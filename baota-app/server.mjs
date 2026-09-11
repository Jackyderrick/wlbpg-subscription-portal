import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import qrcode from "./qrcode.cjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "db.json");
const gsapFile = path.join(root, "assets", "gsap.min.js");
const port = Number(process.env.PORT || 3180);
const adminUser = process.env.ADMIN_USER || "admin";
const adminPassword = process.env.ADMIN_PASSWORD;
const initialInvite = process.env.INITIAL_INVITE || "";
const workerUrl = (process.env.WORKER_URL || "").replace(/\/$/, "");
const workerSecret = process.env.WORKER_ADMIN_SECRET;
const workerUpstreamId = Number(process.env.WORKER_UPSTREAM_ID || 1);
const paymentBase = (process.env.PAYMENT_API_BASE || "").replace(/\/$/, "");
const paymentPid = process.env.PAYMENT_PID;
const paymentKey = process.env.PAYMENT_KEY;
const publicBase = (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");

const requiredEnv = ["ADMIN_PASSWORD", "WORKER_URL", "WORKER_ADMIN_SECRET", "PAYMENT_API_BASE", "PAYMENT_PID", "PAYMENT_KEY", "PUBLIC_BASE_URL"];
const missingEnv = requiredEnv.filter(name => !process.env[name]);
if (missingEnv.length) throw new Error(`缺少必要环境变量：${missingEnv.join(", ")}`);

fs.mkdirSync(dataDir, { recursive: true });

const emptyDb = () => ({
  users: [], sessions: [], invites: [{ code: initialInvite, maxUses: 20, uses: 0, enabled: true }],
  products: [
    { id: "two_day_trial", name: "2 天试用", price: 0, days: 2, nodes: 2 },
    { id: "trial", name: "基础版", price: 1500, days: 30, nodes: 5 },
    { id: "standard", name: "标准版", price: 2500, days: 30, nodes: 10 },
    { id: "premium", name: "高级版", price: 3500, days: 30, nodes: 15 }
  ],
  orders: [], payments: [], audit: []
});

function loadDb() {
  if (!fs.existsSync(dataFile)) return emptyDb();
  try { return JSON.parse(fs.readFileSync(dataFile, "utf8")); } catch { return emptyDb(); }
}

let db = loadDb();
db.products = [
  { id: "two_day_trial", name: "2 天试用", price: 0, days: 2, nodes: 2 },
  { id: "trial", name: "基础版", price: 1500, days: 30, nodes: 5 },
  { id: "standard", name: "标准版", price: 2500, days: 30, nodes: 10 },
  { id: "premium", name: "高级版", price: 3500, days: 30, nodes: 15 }
];
db.users = Array.isArray(db.users) ? db.users : [];
db.orders = Array.isArray(db.orders) ? db.orders : [];
db.payments = Array.isArray(db.payments) ? db.payments : [];
db.users.forEach(user => {
  if (!Number.isFinite(user.balance)) user.balance = 0;
  if (!Array.isArray(user.selectedNodeIds)) {
    const latestOrder = db.orders.find(order => order.userId === user.id && Array.isArray(order.selectedNodeIds));
    user.selectedNodeIds = latestOrder?.selectedNodeIds || [];
  }
});
function saveDb() {
  const tmp = `${dataFile}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2), { mode: 0o600 });
  fs.renameSync(tmp, dataFile);
}
if (!fs.existsSync(dataFile)) saveDb();
const gsapScript = fs.readFileSync(gsapFile);

function id() { return crypto.randomBytes(16).toString("hex"); }
function hash(value) { return crypto.createHash("sha256").update(value).digest("hex"); }
function paymentSign(values) {
  const source = Object.entries(values).filter(([key, value]) => key !== "sign" && key !== "sign_type" && value !== "" && value !== undefined && value !== null && String(value) !== "0").sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, value]) => `${key}=${value}`).join("&");
  return crypto.createHash("md5").update(source + paymentKey).digest("hex");
}
function safeEqualText(a, b) {
  const left = Buffer.from(String(a)); const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
function passwordHash(password, salt = crypto.randomBytes(16).toString("hex")) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
function passwordOk(password, stored) {
  const [salt, expected] = String(stored).split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64);
  const target = Buffer.from(expected, "hex");
  return actual.length === target.length && crypto.timingSafeEqual(actual, target);
}
function send(res, status, body, type = "application/json; charset=utf-8", extra = {}) {
  res.writeHead(status, { "content-type": type, "cache-control": "no-store", "x-content-type-options": "nosniff", ...extra });
  res.end(type.startsWith("application/json") ? JSON.stringify(body) : body);
}
function cleanSessions() { db.sessions = db.sessions.filter(s => Date.parse(s.expiresAt) > Date.now()); }
function currentUser(req) {
  cleanSessions();
  const token = (req.headers.cookie || "").split(";").map(x => x.trim()).find(x => x.startsWith("portal_session="))?.slice(15);
  const session = token && db.sessions.find(s => s.tokenHash === hash(token));
  return session ? db.users.find(u => u.id === session.userId) : null;
}
function safeUser(user) {
  return { id: user.id, email: user.email, role: user.role, status: user.status, balance: Number(user.balance || 0), planId: user.planId || "", selectedNodeIds: user.selectedNodeIds || [], subscriptionUrl: user.subscriptionUrl || "", expiresAt: user.expiresAt || "", createdAt: user.createdAt };
}
async function readJson(req) {
  let raw = "";
  for await (const chunk of req) { raw += chunk; if (raw.length > 200000) throw new Error("请求过大"); }
  return raw ? JSON.parse(raw) : {};
}
function audit(actor, action, detail = "") {
  db.audit.unshift({ id: id(), actor, action, detail, at: new Date().toISOString() });
  db.audit = db.audit.slice(0, 500);
}
async function workerCall(pathname, options = {}) {
  const response = await fetch(workerUrl + pathname, { ...options, headers: { "content-type": "application/json", authorization: `Bearer ${workerSecret}`, ...(options.headers || {}) }, signal: AbortSignal.timeout(30000) });
  const text = await response.text(); let data; try { data = JSON.parse(text); } catch { data = { error: text }; }
  if (!response.ok) throw new Error(data.error || `订阅服务返回 ${response.status}`);
  return data;
}
async function replaceWorkerService(target, payload) {
  const oldWorkerUserId = Number(target.workerUserId || 0);
  const created = await workerCall("/api/users", { method: "POST", body: JSON.stringify(payload) });
  let cleanup = { removed: 0, failed: 0 };
  if (oldWorkerUserId && oldWorkerUserId !== Number(created.id)) {
    try {
      cleanup = await workerCall(`/api/users/${oldWorkerUserId}/disable`, { method: "POST" });
    } catch (error) {
      try { await workerCall(`/api/users/${created.id}/disable`, { method: "POST" }); } catch {}
      throw new Error(`旧套餐清理失败，已撤销本次更换：${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { created, cleanup };
}

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>WLBPG 云端订阅</title><style>
:root{font-family:Inter,"PingFang SC","Microsoft YaHei",system-ui,sans-serif;color:#151627;background:#fff;--violet:#6842e8;--violet2:#855ff3;--lav:#f2efff;--line:#e8e8f1;--muted:#77798a;--green:#20ad67}*{box-sizing:border-box}body{margin:0;background:linear-gradient(180deg,#fff 0,#fbfaff 55%,#fff 100%)}.nav{height:72px;background:#ffffffee;border-bottom:1px solid #efeff4;display:flex;align-items:center;gap:42px;padding:0 max(28px,calc((100% - 1320px)/2));position:sticky;top:0;z-index:30;backdrop-filter:blur(18px)}.brand{font-size:20px;font-weight:800;white-space:nowrap}.brand:before{content:'W';display:inline-grid;place-items:center;width:34px;height:34px;margin-right:10px;border-radius:11px;background:linear-gradient(135deg,#7650ef,#b28cff);color:white;font-size:18px}.nav-links{display:flex;gap:30px;font-size:14px}.nav-links a{color:#414354;text-decoration:none}.nav-spacer{flex:1}#navUser{font-size:14px;color:#57596a}.wrap{max-width:1320px;margin:0 auto;padding:0 28px 70px}.landing{padding-top:58px}.hero{min-height:490px;display:grid;grid-template-columns:1fr 1.08fr;gap:58px;align-items:center;background:radial-gradient(circle at 86% 50%,#eee9ff 0,transparent 42%);padding:34px 0 46px}.hero-copy h1{font-size:54px;line-height:1.16;letter-spacing:-2px;margin:14px 0 20px;max-width:620px}.hero-copy p{font-size:17px;line-height:1.8;color:#767789;max-width:570px}.eyebrow{display:inline-flex;padding:7px 12px;border:1px solid #e5e0fb;border-radius:999px;color:#6745d7;background:#faf9ff;font-size:13px}.hero-actions{display:flex;gap:14px;margin:30px 0}.hero-flow{padding:34px;border:1px solid #eceaf5;border-radius:26px;background:#ffffffd9;box-shadow:0 28px 70px #6044b012}.steps{display:flex;align-items:center;justify-content:space-between;margin-bottom:30px}.step{display:flex;align-items:center;gap:9px;font-weight:700;font-size:14px}.step b{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--violet),var(--violet2));color:#fff}.step-line{height:1px;flex:1;margin:0 16px;background:#d9d5e9}.flow-panels{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}.flow-panel{min-height:210px;padding:18px;border:1px solid #eceaf3;border-radius:18px;background:#fff}.flow-panel h4{margin:0 0 18px}.mini-choice{padding:12px;margin:8px 0;border:1px solid #e6e3ef;border-radius:11px;font-size:13px}.mini-choice.selected{border-color:#7a55ea;background:#f5f1ff;color:#5f3bd4}.link-orb{display:grid;place-items:center;width:76px;height:76px;margin:24px auto 18px;border-radius:50%;background:#eee9ff;color:#6742df;font-size:34px}.benefits{display:flex;gap:24px;flex-wrap:wrap;padding:18px 22px;border:1px solid var(--line);border-radius:16px;background:#fff}.benefits span{font-size:14px}.benefits span:before{content:'✓';color:var(--violet);font-weight:800;margin-right:8px}.section-title{text-align:center;margin:54px 0 26px}.section-title h2{font-size:34px;margin:0 0 10px}.muted{color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin:20px 0}.card{background:#fff;border:1px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 12px 36px #3b286b0a}.price{font-size:34px;font-weight:800}.row{display:flex;gap:10px;flex-wrap:wrap}input,button,select{font:inherit;padding:12px 15px;border-radius:11px;border:1px solid #dcdbe6}input,select{width:100%;margin:7px 0 13px;background:#fff}input:focus,select:focus{outline:3px solid #7b55ed20;border-color:#7b55ed}button{border:0;background:linear-gradient(135deg,var(--violet),var(--violet2));color:#fff;cursor:pointer;font-weight:700;box-shadow:0 8px 20px #6842e82a}button:hover{transform:translateY(-1px)}button.secondary{background:#fff;color:#443a6a;border:1px solid #dcd5f5;box-shadow:none}.hidden{display:none!important}.error{color:#b42318;white-space:pre-wrap}.ok{color:#087443;white-space:pre-wrap}.sub{word-break:break-all;background:#f8f7fc;padding:14px;border:1px solid var(--line);border-radius:12px}table{width:100%;border-collapse:collapse}td,th{text-align:left;padding:13px 10px;border-bottom:1px solid #efeff4;font-size:14px}.pill{background:#eaf8f1;color:#168451;padding:4px 9px;border-radius:999px}.member-head{padding:54px 0 16px}.member-head h1{font-size:38px;margin:0 0 8px}.summary-grid{grid-template-columns:repeat(3,1fr)}.summary-card{min-height:152px}.subscription-card{display:grid;grid-template-columns:1fr 190px;gap:24px;align-items:center}.node-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;margin:16px 0 22px}.node-option{display:flex;align-items:center;gap:10px;border:1px solid #e1ddec;border-radius:14px;padding:15px;background:#fff;cursor:pointer;transition:.18s}.node-option:hover{border-color:#9a7cf0;transform:translateY(-1px)}.node-option:has(input:checked){border-color:#7650ed;background:#f5f2ff;box-shadow:0 0 0 2px #7650ed18}.node-option input{width:18px;height:18px;margin:0;accent-color:#7049e9}.node-name{font-weight:700}.protocol{margin-left:auto;font-size:11px;background:#eeeafe;color:#6440d9;padding:4px 7px;border-radius:999px}.my-node{display:grid;grid-template-columns:1fr auto;align-items:center;padding:14px 10px;border-bottom:1px solid #efeff4}.modal-backdrop{position:fixed;inset:0;background:#17112666;display:flex;align-items:center;justify-content:center;padding:18px;z-index:99;backdrop-filter:blur(5px)}.modal{width:min(460px,100%);background:#fff;border-radius:22px;padding:30px;box-shadow:0 32px 100px #21154144;text-align:center}.modal-icon{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;margin:0 auto 15px;background:#eee9ff;color:#6842e8;font-size:25px}.modal.error-modal .modal-icon{background:#feecec;color:#b42318}.modal h3{font-size:22px;margin:0 0 8px}.modal p{color:#77798a;white-space:pre-wrap;line-height:1.65}.modal button{min-width:120px}.auth-grid{grid-template-columns:1fr 1fr;max-width:900px;margin:34px auto 70px}.auth-grid .card{padding:30px}.auth-grid h2{margin-top:0}.member-mode .landing{display:none}.member-mode .wrap{max-width:1320px}.member-mode .nav-links a:first-child{color:var(--violet);font-weight:700}
.modal-backdrop.hidden{display:none}.qr-card{display:flex;gap:18px;align-items:center;margin:14px 0;padding:14px;background:#f8fafc;border:1px solid #e5eaf2;border-radius:14px}.qr-card img{width:152px;height:152px;background:#fff;border-radius:10px;padding:8px}.qr-help{color:#667085;font-size:14px}.account-menu{position:relative}.account-menu>button{padding:9px 13px;background:#fff;color:#3f3860;border:1px solid #e1d9fb;box-shadow:none}.account-panel{position:absolute;right:0;top:calc(100% + 10px);width:220px;padding:14px;background:#fff;border:1px solid #e9e5f5;border-radius:14px;box-shadow:0 18px 42px #251a4a18;z-index:40}.account-panel p{margin:0 0 12px;word-break:break-all}.account-panel button{width:100%}.auth-actions{display:flex;align-items:center;gap:9px}.auth-actions button{padding:9px 15px;font-size:14px;box-shadow:none}.auth-actions .login-action{background:#fff;color:#51476f;border:1px solid #dfd9ef}.auth-actions .register-action{min-width:70px}@media(max-width:520px){.qr-card{flex-direction:column;text-align:center}.account-menu>button{font-size:0}.account-menu>button:after{content:'账户';font-size:14px}.auth-actions button{padding:8px 10px}}
.amounts{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0}.amounts button{background:#eef4ff;color:#2457a7;border:1px solid #cfe0ff;font-weight:700}.pay-row{display:grid;grid-template-columns:1fr 1fr auto;gap:10px;align-items:end}.pay-row input,.pay-row select{margin-bottom:0}.payment-list{margin-top:16px}.payment-item{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px solid #edf0f5}.payment-paid{color:#087443}.payment-pending{color:#b26a00}@media(max-width:640px){.amounts{grid-template-columns:repeat(2,1fr)}.pay-row{grid-template-columns:1fr}.pay-row button{width:100%}}
#admin .card{overflow-x:auto}#admin td:last-child{min-width:300px}@media(max-width:850px){.nav-links{display:none}.wrap{padding-inline:18px}.hero{grid-template-columns:1fr;padding-top:10px}.hero-copy h1{font-size:40px}.hero-flow{padding:20px}.flow-panels{grid-template-columns:1fr}.flow-panel{min-height:auto}.summary-grid,.auth-grid{grid-template-columns:1fr}.subscription-card{grid-template-columns:1fr}.qr-card{justify-content:flex-start}}@media(max-width:520px){.hero-copy h1{font-size:34px}.hero{gap:20px}.steps{align-items:flex-start}.step{font-size:12px;flex-direction:column}.step-line{margin-top:16px}.qr-card{flex-direction:column;text-align:center}.amounts{grid-template-columns:repeat(2,1fr)}.pay-row{grid-template-columns:1fr}.pay-row button{width:100%}}
/* visual refresh */body{background:#f5f6fa;color:#16192b}.nav{height:68px;background:#fdfdffed;border-color:#e6e8f0}.brand:before{background:#29264f;border-radius:10px}.landing{padding-top:18px}.hero{min-height:540px;padding:58px 52px;border-radius:28px;background:linear-gradient(125deg,#fafaff,#f0efff 57%,#e8efff);position:relative;overflow:hidden}.hero:after{content:"";position:absolute;width:420px;height:420px;right:-160px;bottom:-210px;border:1px solid #d0c9ff;border-radius:50%;box-shadow:0 0 0 50px #ddd9ff55}.hero-copy,.hero-flow{position:relative;z-index:1}.hero-copy h1{font-size:clamp(40px,4.4vw,62px);letter-spacing:-3px}.hero-flow{background:#ffffffc7;border-color:#fff;box-shadow:0 28px 65px #37307c1c}.card{border-color:#e5e7ef;box-shadow:0 12px 36px #2529520a}.subscription-card{border-top:3px solid #5444b7}button{background:#29264f;box-shadow:none;border-radius:10px}button:hover{background:#413b78}.node-option:has(input:checked){background:#f3f1ff;border-color:#6254c5}.qr-card{background:linear-gradient(135deg,#f8f8ff,#f1f4ff)}(max-width:850px){.hero{padding:40px 26px;border-radius:0}.hero:after{display:none}}</style></head><body><nav class="nav"><div class="brand">WLBPG 云端订阅</div><div class="nav-links"><a href="#home">首页</a><a href="#plans">套餐</a><a href="#nodes" onclick="goNodes(event)">节点</a><a href="#help">使用帮助</a></div><div class="nav-spacer"></div><div id="navUser"></div></nav><main class="wrap"><div class="landing" id="home"><section class="hero"><div class="hero-copy"><span class="eyebrow">轻松管理专属订阅</span><h1>更简单地选择节点，随时管理你的订阅</h1><p>注册账户，充值余额，自由选择套餐与节点，一键获取订阅链接。</p><div class="hero-actions"><button onclick="document.querySelector('#guest').scrollIntoView({behavior:'smooth'})">立即开始</button><button class="secondary" onclick="document.querySelector('#plans').scrollIntoView({behavior:'smooth'})">查看套餐</button></div><div class="benefits"><span>余额支付</span><span>订阅二维码</span><span>到期自动停用</span></div></div><div class="hero-flow"><div class="steps"><span class="step"><b>1</b>选择套餐</span><i class="step-line"></i><span class="step"><b>2</b>选择节点</span><i class="step-line"></i><span class="step"><b>3</b>复制订阅</span></div><div class="flow-panels"><div class="flow-panel"><h4>选择套餐</h4><div class="mini-choice">基础版</div><div class="mini-choice selected">进阶版 · 推荐</div><div class="mini-choice">高级版</div></div><div class="flow-panel"><h4>选择节点</h4><div class="mini-choice selected">节点 A</div><div class="mini-choice">节点 B</div><div class="mini-choice">节点 C</div></div><div class="flow-panel"><div class="link-orb">↗</div><h4 style="text-align:center">订阅已生成</h4><button style="width:100%">复制订阅链接</button></div></div></div></section><section id="plans"><div class="section-title"><h2>选择适合你的套餐</h2><p class="muted">灵活选择，随时升级或更换，满足不同使用需求。</p></div><div class="grid"><div class="card"><h3>体验版</h3><div class="price">免费</div><p class="muted">7 天 · 最多 3 个节点</p></div><div class="card" style="border-color:#7b55ed;box-shadow:0 16px 40px #6842e816"><span class="eyebrow">推荐</span><h3>标准版</h3><div class="price">¥9.90</div><p class="muted">30 天 · 最多 5 个节点</p></div><div class="card"><h3>高级版</h3><div class="price">¥19.90</div><p class="muted">30 天 · 最多 8 个节点</p></div></div></section></div>
<section id="guest"><div class="section-title"><h2>开始使用</h2><p class="muted">登录已有账户，或直接创建新账户。</p></div><div class="grid auth-grid"><div class="card"><h2>登录</h2><input id="loginEmail" placeholder="邮箱"><input id="loginPass" type="password" placeholder="密码"><button onclick="login()">登录账户</button></div><div class="card"><h2>注册账户</h2><input id="regEmail" placeholder="邮箱"><input id="regPass" type="password" placeholder="至少8位密码"><p class="muted">注册后即可充值并选择套餐。</p><button onclick="register()">立即注册</button></div></div></section>
<section id="member" class="hidden"><div class="member-head"><h1>欢迎回来，管理你的订阅</h1><p class="muted">查看账户信息、订阅链接与节点状态，轻松管理你的服务。</p></div><div class="grid summary-grid"><div class="card summary-card"><p class="muted">账户余额</p><div class="price">¥<span id="balance">0.00</span></div><button onclick="document.querySelector('#rechargeCard').scrollIntoView({behavior:'smooth'})">充值余额</button></div><div class="card summary-card"><p class="muted">当前套餐</p><h2 id="currentPlan">未开通</h2><span id="status" class="pill"></span></div><div class="card summary-card"><p class="muted">到期时间</p><h2 id="expiry">未开通</h2></div></div><div class="card subscription-card"><div><h2>订阅链接</h2><p class="muted">扫码或复制链接导入客户端</p><div id="subBox" class="hidden"><div id="sub" class="sub"></div><p class="row"><button onclick="copySub()">一键复制</button><button class="secondary" onclick="openSub()">打开订阅</button></p></div><p id="waiting" class="muted">账号已注册，购买套餐后即可生成订阅链接。</p></div><div class="qr-card"><img id="subQr" alt="订阅链接二维码"><div><strong>订阅二维码</strong><p class="qr-help">支持扫码快速导入</p></div></div></div><div id="myNodesCard" class="card hidden"><h2>我购买的节点</h2><div id="myNodes"></div></div>
<div id="rechargeCard" class="card"><h2>余额充值</h2><p class="muted">支付成功后余额自动到账，可用于购买套餐。</p><div class="amounts"><button onclick="startRecharge(10)">充值 ¥10</button><button onclick="startRecharge(30)">充值 ¥30</button><button onclick="startRecharge(50)">充值 ¥50</button><button onclick="startRecharge(100)">充值 ¥100</button></div><div class="pay-row"><div><label>自定义金额</label><input id="rechargeAmount" type="number" min="1" max="10000" step="0.01" placeholder="1.00–10000.00 元"></div><div><label>支付方式</label><select id="paymentType"><option value="cashier">收银台选择</option><option value="alipay">支付宝</option><option value="wxpay">微信支付</option><option value="usdt">USDT</option></select></div><button onclick="startRecharge()">立即充值</button></div><div id="paymentList" class="payment-list"></div></div>
<h2>余额购买套餐</h2><p class="muted">先选择套餐，再勾选希望使用的节点。节点数不能超过套餐上限。</p><div id="products" class="grid"></div><div id="nodePicker" class="card hidden"><h3>选择节点</h3><p id="nodeLimitText" class="muted"></p><div id="nodes" class="node-grid"></div><button id="confirmPurchase" onclick="purchase()">确认使用余额购买</button></div></section>
<section id="admin" class="hidden"><div class="grid"><div class="card"><h2>用户统计</h2><div class="price" id="userCount">0</div><p class="muted">已注册普通用户</p></div><div class="card"><h2>已开通</h2><div class="price" id="activeCount">0</div><p class="muted">拥有订阅的用户</p></div></div><div class="card"><h2>用户管理</h2><p class="muted">用户可直接在前台注册。选择套餐可自动创建专属订阅和 DNS。</p><table><thead><tr><th>用户</th><th>状态</th><th>余额</th><th>到期</th><th>订阅</th><th>操作</th></tr></thead><tbody id="users"></tbody></table><p id="emptyUsers" class="muted hidden">暂时没有普通用户。</p></div></section>
<p id="msg" class="error"></p></main><div id="modalWrap" class="modal-backdrop hidden"><div id="modalBox" class="modal"><div class="modal-icon" id="modalIcon">✓</div><h3 id="modalTitle">操作成功</h3><p id="modalText"></p><input id="modalInput" class="hidden" inputmode="decimal"><div class="row" style="justify-content:center"><button id="modalCancel" class="secondary hidden" onclick="finishModal(false)">取消</button><button id="modalOk" onclick="finishModal(true)">知道了</button></div></div></div><script>
const $=s=>document.querySelector(s);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
$('#subQr').onerror=()=>{$('#subQr').closest('.qr-card').classList.add('hidden')};$('#subQr').onload=()=>{$('#subQr').closest('.qr-card').classList.remove('hidden')};
document.querySelectorAll('.muted').forEach(x=>{if(x.textContent.includes('充值功能将在支付模块启用后开放'))x.textContent='支持在线充值，支付成功后余额自动到账。'});
async function api(url,opt={}){const r=await fetch(url,{...opt,headers:{'content-type':'application/json',...opt.headers}});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d={error:t}}if(!r.ok)throw Error(d.error||'请求失败');return d}
let products=[],chosenPlan='',nodeCatalog=[];
function applyCandyInspiredVisual(){if(document.querySelector('#candyInspiredVisual'))return;const style=document.createElement('style');style.id='candyInspiredVisual';style.textContent=\`
:root{--coral:#ff714b;--ink:#111217;--paper:#fbfbfc;--soft:#f2f3f5;--muted:#6b6e78;--line:#e3e4e8}.nav{height:80px;padding-inline:max(28px,calc((100% - 1240px)/2));gap:48px;background:#fffffff2;border-color:#ececef;backdrop-filter:blur(14px)}.brand{font-size:17px;letter-spacing:-.4px;color:var(--ink)}.brand:before{width:31px;height:31px;border-radius:9px;margin-right:9px;background:var(--ink);font-size:16px}.nav-links{gap:28px;font-size:13px}.nav-links a{color:#464852}.nav-links a:hover{color:var(--coral)}.auth-actions{gap:16px}.auth-actions button,.account-menu>button{border-radius:6px;padding:9px 14px}.auth-actions .login-action{border:0;background:transparent;color:var(--ink)}.auth-actions .register-action{background:var(--ink);color:white}.wrap{max-width:1240px;padding:0 28px 84px}.landing{padding-top:22px}.hero{min-height:552px;grid-template-columns:minmax(0,.92fr) minmax(460px,1.08fr);gap:72px;padding:56px 0 48px;background:transparent;border-bottom:1px solid var(--line);border-radius:0;overflow:visible}.hero:after{display:none}.hero-copy{align-self:center}.eyebrow{padding:0;border:0;border-radius:0;background:transparent;color:var(--coral);font-size:12px;font-weight:800;letter-spacing:1.4px}.hero-copy h1{max-width:580px;margin:18px 0;font-size:clamp(48px,5.3vw,72px);line-height:1.04;letter-spacing:-4px;color:var(--ink)}.hero-copy p{max-width:480px;color:#656872;font-size:16px;line-height:1.8}.hero-actions{margin:30px 0 34px}.hero-actions button{border-radius:6px;background:var(--ink);padding:14px 22px;box-shadow:none}.hero-actions button:hover{background:#2a2d35;transform:translateY(-2px)}.hero-actions .secondary{background:transparent;border-color:#c9cbd1;color:var(--ink)}.benefits{gap:18px;padding:0;border:0;border-radius:0;background:transparent}.benefits span{font-size:12px;color:#575a63}.benefits span:before{content:'●';color:var(--coral);font-size:8px;vertical-align:1px;margin-right:7px}.hero-flow{padding:28px;border:1px solid #1e2027;border-radius:4px;background:#17181d;box-shadow:18px 18px 0 #ffded5;transform:translateY(8px)}.steps{margin-bottom:25px}.step{color:#f4f4f6;font-size:13px}.step b{width:28px;height:28px;border-radius:50%;background:var(--coral);font-size:12px}.step-line{background:#4b4d57;margin:0 12px}.flow-panels{gap:10px}.flow-panel{min-height:222px;padding:15px;border-color:#30323c;border-radius:3px;background:#21232b;color:#f8f8fa}.flow-panel h4{font-size:13px;margin-bottom:13px}.mini-choice{padding:10px;margin:7px 0;border-color:#3d404a;border-radius:3px;color:#cdd0d8;font-size:12px}.mini-choice.selected{border-color:var(--coral);background:#ff714b18;color:#fff}.link-orb{width:64px;height:64px;margin:30px auto 16px;border-radius:50%;background:var(--coral);color:#111217;font-size:28px}.flow-panel button{border-radius:4px;background:var(--coral);color:#17181d;font-size:12px}.section-title{text-align:left;display:flex;align-items:end;justify-content:space-between;gap:22px;margin:82px 0 26px;padding-bottom:18px;border-bottom:1px solid var(--line)}.section-title h2{font-size:34px;letter-spacing:-1.5px;color:var(--ink);margin:0}.section-title p{max-width:410px;margin:0;text-align:right;font-size:14px}.grid{gap:0;margin:0}.landing #plans .grid{grid-template-columns:repeat(3,1fr);border:1px solid var(--line);border-radius:5px;overflow:hidden}.landing #plans .card{min-height:238px;padding:28px;border:0;border-radius:0;box-shadow:none;border-right:1px solid var(--line);background:#fff}.landing #plans .card:last-child{border-right:0}.landing #plans .card:nth-child(2){background:var(--ink)!important;border-color:var(--ink)!important;box-shadow:none!important;color:#fff}.landing #plans .card:nth-child(2) .muted{color:#c2c4cb}.landing #plans .eyebrow{color:#ff9e85}.landing #plans .price{font-size:48px;letter-spacing:-2px;margin:35px 0 8px}.card{border-radius:5px;border-color:var(--line);box-shadow:none}.auth-grid{max-width:none;margin:0;background:#f5f5f6;padding:28px}.auth-grid .card{padding:32px;background:#fff}.member-mode .landing{display:none}.member-mode .member-head h1{color:var(--ink);letter-spacing:-1.5px}.member-mode .card{border-radius:5px}.member-mode button{border-radius:5px;background:var(--ink);box-shadow:none}.member-mode button.secondary{background:#fff;color:var(--ink)}.modal{border-radius:5px}.modal button{border-radius:5px;background:var(--ink)}@media(max-width:850px){.nav{height:68px;padding-inline:18px}.hero{min-height:auto;grid-template-columns:1fr;gap:34px;padding:52px 0 44px}.hero-copy h1{font-size:48px;letter-spacing:-3px}.hero-flow{transform:none;box-shadow:10px 10px 0 #ffded5}.landing #plans .grid{grid-template-columns:1fr}.landing #plans .card{min-height:0;border-right:0;border-bottom:1px solid var(--line)}.landing #plans .card:last-child{border-bottom:0}.section-title{display:block;margin-top:56px}.section-title p{text-align:left;margin-top:10px}.auth-grid{padding:18px}}@media(max-width:520px){.hero-copy h1{font-size:41px}.hero-actions{flex-wrap:wrap}.hero-actions button{width:100%}.benefits{display:grid;grid-template-columns:1fr 1fr;gap:12px}.hero-flow{padding:18px}.flow-panels{grid-template-columns:1fr}.flow-panel{min-height:auto}.steps{gap:8px}.step{font-size:11px}.step-line{margin:0 3px}.section-title h2{font-size:29px}}
\`;document.head.appendChild(style);const title=document.querySelector('.hero-copy h1');const intro=document.querySelector('.hero-copy p');if(title)title.textContent='稳定连接世界，订阅一站掌控';if(intro)intro.textContent='从选择套餐到导入节点，用一个清晰的账户管理每一次连接。'}
applyCandyInspiredVisual();
function initPortalMotion(){const g=window.gsap;if(!g||window.__portalMotionReady||matchMedia('(prefers-reduced-motion: reduce)').matches)return;window.__portalMotionReady=true;document.documentElement.dataset.portalMotion='ready';const entering=['.nav','.hero-copy > *','.hero-flow','.landing #plans .card'];g.set(entering,{willChange:'transform,opacity'});const tl=g.timeline({defaults:{ease:'power3.out'}});tl.from('.nav',{y:-14,autoAlpha:0,duration:.42}).from('.hero-copy > *',{y:22,autoAlpha:0,duration:.58,stagger:.08},'<.08').from('.hero-flow',{y:30,autoAlpha:0,scale:.985,duration:.68},'<.14').from('.landing #plans .card',{y:20,autoAlpha:0,duration:.48,stagger:.1},'-=.15');document.addEventListener('change',event=>{const choice=event.target.closest?.('[data-node]')?.closest('.node-option');if(choice)g.fromTo(choice,{scale:.975},{scale:1,duration:.32,ease:'back.out(1.8)',overwrite:'auto'});});}
function loadPortalMotion(){if(window.gsap)return initPortalMotion();const script=document.createElement('script');script.src='/assets/gsap.min.js';script.async=true;script.onload=()=>{document.documentElement.dataset.portalMotion='loaded';initPortalMotion()};script.onerror=()=>{document.documentElement.dataset.portalMotion='unavailable'};document.head.appendChild(script)}
loadPortalMotion();
function renderMyNodes(selectedNodeIds){if(!selectedNodeIds?.length){$('#myNodesCard').classList.add('hidden');return}$('#myNodesCard').classList.remove('hidden');$('#myNodes').innerHTML='<p class="muted">节点列表加载中…</p>';api('/api/nodes').then(d=>{nodeCatalog=d.nodes;const mine=nodeCatalog.filter(n=>selectedNodeIds.includes(n.id));$('#myNodes').innerHTML=mine.map(n=>'<div class="my-node"><span class="node-name">'+esc(displayNodeName(n.name))+'</span><span class="protocol">'+esc(n.protocol.toUpperCase())+'</span></div>').join('')||'<p class="muted">暂无可用节点</p>'}).catch(()=>{$('#myNodes').innerHTML='<p class="muted">节点列表暂时不可用，请稍后刷新。</p>'})}
function renderLandingPlans(list){const wrap=document.querySelector('#plans .grid');if(!wrap||!list?.length)return;wrap.innerHTML=list.map((p,index)=>'<div class="card"'+(index===1?' style="border-color:#7b55ed;box-shadow:0 16px 40px #6842e816"':'')+'>'+(index===1?'<span class="eyebrow">推荐</span>':'')+'<h3>'+esc(p.name)+'</h3><div class="price">¥'+(p.price/100).toFixed(0)+'</div><p class="muted">'+p.days+' 天 · 最多 '+p.nodes+' 个节点</p></div>').join('')}
function displayNodeName(name){const pairs=[['United States','美国'],['Malaysia','马来西亚'],['Singapore','新加坡'],['Japan','日本'],['Korea','韩国'],['Netherlands','荷兰'],['United Kingdom','英国'],['Hong Kong','香港'],['Taiwan','台湾'],['Germany','德国']];for(const [en,zh] of pairs){if(name.includes(en))return '节点 · '+name.replace(en,zh)}return name.startsWith('节点 · ')?name:'节点 · '+name}
function enhanceNavUser(){const nav=$('#navUser');const email=nav?.textContent?.trim();if(!email||email==='登录 / 注册'||nav.querySelector('.account-menu'))return;if(!email.includes('@')&&email!=='admin')return;nav.innerHTML='<div class="account-menu"><button type="button" onclick="toggleAccountMenu()">'+esc(email)+' ▾</button><div id="accountPanel" class="account-panel hidden"><p class="muted">已登录账户</p><p>'+esc(email)+'</p><button class="secondary" onclick="logout()">退出登录</button></div></div>'}
function toggleAccountMenu(){$('#accountPanel')?.classList.toggle('hidden')}
function showAuth(mode){const target=mode==='register'?$('#regEmail'):$('#loginEmail');$('#guest').scrollIntoView({behavior:'smooth'});setTimeout(()=>target?.focus(),350)}
function goNodes(event){event?.preventDefault();if($('#member')?.classList.contains('hidden'))return showAuth('login');const mine=$('#myNodesCard');if(mine&&!mine.classList.contains('hidden'))return mine.scrollIntoView({behavior:'smooth',block:'start'});$('#products')?.scrollIntoView({behavior:'smooth',block:'start'});showModal('选择节点','请先选择一个套餐，再勾选希望使用的节点。',true)}
async function refresh(){try{const d=await api('/api/me');products=d.products;document.body.classList.toggle('member-mode',!!d.user);$('#guest').classList.toggle('hidden',!!d.user);$('#member').classList.toggle('hidden',!d.user);$('#admin').classList.toggle('hidden',d.user?.role!=='admin');$('#navUser').innerHTML=d.user?'<span>'+esc(d.user.email)+'</span>':'<div class="auth-actions"><button type="button" class="login-action" onclick="showAuth(\\'login\\')">登录</button><button type="button" class="register-action" onclick="showAuth(\\'register\\')">注册</button></div>';if(!d.user)return;$('#status').textContent=d.user.status==='active'?'使用中':d.user.status;$('#balance').textContent=(Number(d.user.balance||0)/100).toFixed(2);const plan=d.products.find(p=>p.id===d.user.planId);$('#currentPlan').textContent=plan?plan.name:'未开通';$('#expiry').textContent=d.user.expiresAt?new Date(d.user.expiresAt).toLocaleDateString('zh-CN'):'未开通';const hasSub=!!d.user.subscriptionUrl;$('#subBox').classList.toggle('hidden',!hasSub);$('#waiting').classList.toggle('hidden',hasSub);$('#sub').textContent=d.user.subscriptionUrl||'';const qrCard=$('#subQr').closest('.qr-card');qrCard.classList.toggle('hidden',!hasSub);if(hasSub)$('#subQr').src='/api/subscription-qr?ts='+Date.now();$('#products').innerHTML=d.products.map(p=>'<div class="card"><h3>'+esc(p.name)+'</h3><div class="price">'+(p.price?('¥'+(p.price/100).toFixed(2)):'免费')+'</div><p class="muted">'+p.days+' 天 · 最多 '+p.nodes+' 个节点</p><button data-buy="'+p.id+'">选择套餐</button></div>').join('');document.querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>choosePlan(b.dataset.buy));renderMyNodes(d.user.selectedNodeIds);if(d.user.role==='admin')loadUsers()}catch(e){msg(e)}}
async function login(){run(async()=>{await api('/api/login',{method:'POST',body:JSON.stringify({email:loginEmail.value,password:loginPass.value})});await refresh()})}
async function register(){run(async()=>{await api('/api/register',{method:'POST',body:JSON.stringify({email:regEmail.value,password:regPass.value})});await refresh()})}
async function logout(){await api('/api/logout',{method:'POST'});location.reload()}
async function startRecharge(preset){const amount=preset||Number($('#rechargeAmount').value);if(!Number.isFinite(amount)||amount<1||amount>10000)return showModal('充值金额无效','请输入 1.00–10000.00 元之间的金额。',false);await run(async()=>{const d=await api('/api/payment/create',{method:'POST',body:JSON.stringify({amount,type:$('#paymentType').value})});const form=document.createElement('form');form.method='POST';form.action=d.action;Object.entries(d.fields).forEach(([name,value])=>{const input=document.createElement('input');input.type='hidden';input.name=name;input.value=value;form.appendChild(input)});document.body.appendChild(form);form.submit()})}
async function loadPayments(){try{const d=await api('/api/payment/orders');$('#paymentList').innerHTML=d.payments.length?'<h3>最近充值</h3>'+d.payments.map(p=>'<div class="payment-item"><span>¥'+(p.amount/100).toFixed(2)+' · '+new Date(p.createdAt).toLocaleString()+'</span><strong class="'+(p.status==='paid'?'payment-paid':'payment-pending')+'">'+(p.status==='paid'?'已到账':'待支付')+'</strong></div>').join(''):''}catch{}}
async function checkPaymentReturn(){const params=new URLSearchParams(location.search);const order=params.get('order');if(params.get('payment')!=='return'||!order)return;history.replaceState({},'',location.pathname);for(let i=0;i<5;i++){try{const d=await api('/api/payment/status?order='+encodeURIComponent(order));if(d.status==='paid'){await refresh();await loadPayments();return showModal('充值成功','支付已确认，¥'+(d.amount/100).toFixed(2)+' 已加入账户余额。',true)}}catch{}await new Promise(r=>setTimeout(r,1800))}showModal('正在确认支付','支付结果可能稍有延迟，请稍后刷新页面查看余额。',true)}
let adminUsers=[];
async function loadUsers(){const d=await api('/api/admin/users');adminUsers=d.users;$('#userCount').textContent=d.users.length;$('#activeCount').textContent=d.users.filter(u=>u.subscriptionUrl).length;$('#emptyUsers').classList.toggle('hidden',d.users.length>0);$('#users').innerHTML=d.users.map(u=>'<tr><td>'+esc(u.email)+'</td><td>'+esc(u.status)+'</td><td><strong>¥'+(Number(u.balance||0)/100).toFixed(2)+'</strong></td><td>'+(u.expiresAt?new Date(u.expiresAt).toLocaleString():'—')+'</td><td>'+(u.subscriptionUrl?'<span class="pill">已开通</span>':'未开通')+'</td><td><select data-plan="'+u.id+'"><option value="trial">体验版</option><option value="standard" selected>标准版</option><option value="premium">高级版</option></select><div class="row"><button data-view="'+u.id+'">查看详情</button><button data-open="'+u.id+'">自动开通</button><button class="secondary" data-balance="'+u.id+'">调整余额</button><button class="secondary" data-delete="'+u.id+'" style="color:#b42318">删除用户</button></div></td></tr>').join('');document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>viewUser(b.dataset.view));document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>openService(b.dataset.open));document.querySelectorAll('[data-balance]').forEach(b=>b.onclick=()=>changeBalance(b.dataset.balance));document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteUser(b.dataset.delete))}
async function viewUser(id){const u=adminUsers.find(x=>x.id===id);if(!u)return;const plan=products.find(x=>x.id===u.planId);let access='暂无订阅访问记录';try{const d=await api('/api/admin/users/'+id+'/accesses');const s=d.summary||{};const recent=(d.recent||[]).slice(0,5).map(x=>(x.device_kind||'其他')+(x.country?' · '+x.country:'')+' · '+new Date(x.last_seen_at+'Z').toLocaleString()).join('\\n');access='近24小时估算设备：'+Number(s.devices_24h||0)+' 台\\n近7天估算设备：'+Number(s.devices_7d||0)+' 台\\n近7天拉取次数：'+Number(s.hits_7d||0)+' 次\\n最近拉取：'+(s.last_seen_at?new Date(s.last_seen_at+'Z').toLocaleString():'暂无')+(recent?'\\n最近设备：\\n'+recent:'')}catch(e){access='设备记录暂时不可用'}showModal('用户详情','邮箱：'+u.email+'\\n账户余额：¥'+(Number(u.balance||0)/100).toFixed(2)+'\\n状态：'+u.status+'\\n套餐：'+(plan?.name||'未开通')+'\\n到期时间：'+(u.expiresAt?new Date(u.expiresAt).toLocaleString():'未开通')+'\\n已购节点：'+(u.selectedNodeIds?.length||0)+' 个\\n订阅状态：'+(u.subscriptionUrl?'已开通':'未开通')+'\\n\\n'+access+'\\n\\n说明：设备数按订阅拉取特征估算，不等同于节点实时在线数。',true)}
async function deleteUser(id){const u=adminUsers.find(x=>x.id===id);if(!u)return;const pending=inputModal('删除用户','此操作会删除账号和登录会话、清理订阅及 DNS，并保留财务审计记录。请输入该用户邮箱确认：',u.email);$('#modalIcon').textContent='!';const typed=await pending;if(typed===null)return;if(typed.trim().toLowerCase()!==u.email.toLowerCase())return showModal('确认信息不匹配','输入的邮箱与目标用户不一致，未执行删除。',false);await run(async()=>{const d=await api('/api/admin/users/'+id+'/delete',{method:'POST'});await loadUsers();showModal('用户已删除','账号已删除，并清理 '+Number(d.removedDns||0)+' 条 DNS 记录。财务记录已保留。',true)})}
async function openService(id){const plan=document.querySelector('[data-plan="'+id+'"]')?.value||'standard';await run(async()=>{const d=await api('/api/admin/users/'+id+'/provision',{method:'POST',body:JSON.stringify({plan})});msg('开通成功：'+d.nodes+' 个节点',true);await loadUsers()})}
async function changeBalance(id){const yuan=await inputModal('调整用户余额','请输入调整后的余额（元）','例如：100.00');if(yuan===null)return;if(yuan.trim()===''||!Number.isFinite(Number(yuan))||Number(yuan)<0)return showModal('金额无效','请输入大于或等于 0 的数字。',false);await run(async()=>{await api('/api/admin/users/'+id+'/balance',{method:'POST',body:JSON.stringify({balanceYuan:Number(yuan)})});msg('余额已更新',true);await loadUsers()})}
async function choosePlan(id){chosenPlan=id;const p=products.find(x=>x.id===id);const d=await api('/api/nodes');nodeCatalog=d.nodes;$('#nodeLimitText').textContent='已选择 0 / '+p.nodes+' 个节点';$('#nodes').innerHTML=d.nodes.map(n=>'<label class="node-option"><input type="checkbox" data-node="'+n.id+'"><span class="node-name">'+esc(displayNodeName(n.name))+'</span>'+(n.sourceName?'<span class="node-source">'+esc(n.sourceName)+'</span>':'')+'<span class="protocol">'+esc(n.protocol.toUpperCase())+'</span></label>').join('');document.querySelectorAll('[data-node]').forEach(c=>c.onchange=()=>updateNodeCount(p.nodes,c));$('#nodePicker').classList.remove('hidden');$('#nodePicker').scrollIntoView({behavior:'smooth'})}
function updateNodeCount(limit,changed){const checked=document.querySelectorAll('[data-node]:checked');if(checked.length>limit){changed.checked=false;showModal('选择数量已达上限','该套餐最多选择 '+limit+' 个节点。',false)}$('#nodeLimitText').textContent='已选择 '+document.querySelectorAll('[data-node]:checked').length+' / '+limit+' 个节点'}
async function purchase(){const p=products.find(x=>x.id===chosenPlan);const ids=Array.from(document.querySelectorAll('[data-node]:checked')).map(x=>Number(x.dataset.node));if(!p||!ids.length)return showModal('请选择节点','请至少选择一个希望使用的节点。',false);if(ids.length>p.nodes)return showModal('超过套餐上限','请减少所选节点数量。',false);if(!await confirmModal('确认购买','购买 '+p.name+'，将使用余额并开通所选的 '+ids.length+' 个节点。'))return;await run(async()=>{await api('/api/purchase',{method:'POST',body:JSON.stringify({plan:chosenPlan,selectedNodeIds:ids})});$('#nodePicker').classList.add('hidden');await refresh();showModal('购买成功','套餐已开通，订阅链接和所选节点已更新。',true)})}
let chosenMonths=1;const choosePlanBase=choosePlan;
choosePlan=async function(id){await choosePlanBase(id);const product=products.find(p=>p.id===id);if(!product)return;chosenMonths=1;let picker=$('#durationPicker');if(!picker){picker=document.createElement('div');picker.id='durationPicker';$('#nodes').before(picker)}const months=product.id==='two_day_trial'?[1]:[1,3,6,12];const totalFor=monthsValue=>Math.round(product.price*monthsValue*(monthsValue>=6 ? .8 : 1));const render=()=>{const total=totalFor(chosenMonths);picker.innerHTML='<h4>购买时长</h4><p class="muted">'+(product.id==='two_day_trial'?'试用套餐为 2 天，不支持延长。':'6 个月与 12 个月享 8 折优惠。')+'</p><div class="row">'+months.map(monthsValue=>'<button type="button" class="'+(monthsValue===chosenMonths?'':'secondary')+'" data-months="'+monthsValue+'">'+(product.id==='two_day_trial'?'2 天试用':monthsValue+' 个月 · ¥'+(totalFor(monthsValue)/100).toFixed(2))+'</button>').join('')+'</div><p class="muted">本次合计：¥'+(total/100).toFixed(2)+'</p>';picker.querySelectorAll('[data-months]').forEach(button=>button.onclick=()=>{chosenMonths=Number(button.dataset.months);render()})};render()};
purchase=async function(){const product=products.find(p=>p.id===chosenPlan);const selectedNodeIds=Array.from(document.querySelectorAll('[data-node]:checked')).map(item=>Number(item.dataset.node));if(!product||!selectedNodeIds.length)return showModal('请选择节点','请至少选择一个希望使用的节点。',false);if(selectedNodeIds.length>product.nodes)return showModal('超过套餐上限','请减少所选节点数量。',false);const months=product.id==='two_day_trial'?1:chosenMonths;const total=Math.round(product.price*months*(months>=6 ? .8 : 1));const label=product.id==='two_day_trial'?'领取 2 天试用':'购买 '+product.name+' '+months+' 个月，合计 ¥'+(total/100).toFixed(2);if(!await confirmModal('确认购买',label+'，将开通所选的 '+selectedNodeIds.length+' 个节点。'))return;await run(async()=>{await api('/api/purchase',{method:'POST',body:JSON.stringify({plan:chosenPlan,months,selectedNodeIds})});$('#nodePicker').classList.add('hidden');await refresh();showModal('购买成功',product.id==='two_day_trial'?'2 天试用已开通，订阅链接和所选节点已更新。':'套餐已开通，订阅链接和所选节点已更新。',true)})};
async function addInvite(){await run(async()=>{await api('/api/admin/invites',{method:'POST',body:JSON.stringify({code:newInvite.value,maxUses:20})});msg('邀请码已创建',true)})}
let modalResolve=null,modalMode='notice';function resetModal(){modalMode='notice';$('#modalInput').classList.add('hidden');$('#modalInput').value='';$('#modalCancel').classList.add('hidden');$('#modalOk').textContent='知道了'}function showModal(title,text,ok=true){resetModal();$('#modalTitle').textContent=title;$('#modalText').textContent=text;$('#modalIcon').textContent=ok?'✓':'!';$('#modalBox').classList.toggle('error-modal',!ok);$('#modalWrap').classList.remove('hidden')}function confirmModal(title,text){return new Promise(resolve=>{modalResolve=resolve;modalMode='confirm';$('#modalTitle').textContent=title;$('#modalText').textContent=text;$('#modalIcon').textContent='?';$('#modalBox').classList.remove('error-modal');$('#modalInput').classList.add('hidden');$('#modalCancel').classList.remove('hidden');$('#modalOk').textContent='确认购买';$('#modalWrap').classList.remove('hidden')})}function inputModal(title,text,placeholder=''){return new Promise(resolve=>{modalResolve=resolve;modalMode='input';$('#modalTitle').textContent=title;$('#modalText').textContent=text;$('#modalIcon').textContent='¥';$('#modalBox').classList.remove('error-modal');$('#modalCancel').classList.remove('hidden');$('#modalOk').textContent='确认';$('#modalInput').placeholder=placeholder;$('#modalInput').classList.remove('hidden');$('#modalWrap').classList.remove('hidden');setTimeout(()=>$('#modalInput').focus(),50)})}function finishModal(answer){$('#modalWrap').classList.add('hidden');const resolve=modalResolve;const value=modalMode==='input'?(answer?$('#modalInput').value:null):answer;modalResolve=null;resetModal();if(resolve)resolve(value)}function copySub(){navigator.clipboard.writeText($('#sub').textContent);showModal('复制成功','订阅链接已经复制到剪贴板。',true)}function openSub(){const url=$('#sub').textContent;if(url)window.open(url,'_blank','noopener')}function msg(t,ok=false){$('#msg').className=ok?'ok':'error';$('#msg').textContent=t||'';if(t)showModal(ok?'操作成功':'操作失败',String(t),ok)}async function run(fn){try{msg('');await fn()}catch(e){msg(e.message)}}refresh();
const roleTimer=setInterval(()=>{const isAdmin=$('#navUser').textContent.trim()==='admin';enhanceNavUser();if(isAdmin){ $('#rechargeCard').classList.add('hidden');clearInterval(roleTimer)}else if(!$('#member').classList.contains('hidden')){loadPayments();clearInterval(roleTimer)}},300);setTimeout(()=>clearInterval(roleTimer),5000);setInterval(enhanceNavUser,600);setTimeout(()=>api('/api/me').then(d=>renderLandingPlans(d.products)).catch(()=>{}),0);checkPaymentReturn();
</script></body></html>`;

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === "GET" && url.pathname === "/") return send(res, 200, html, "text/html; charset=utf-8", { "cache-control": "public, max-age=60, stale-while-revalidate=300", "content-security-policy": `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; form-action 'self' ${paymentBase} https://motionpay.net; frame-ancestors 'none'` });
    if (req.method === "GET" && url.pathname === "/assets/gsap.min.js") return send(res, 200, gsapScript, "application/javascript; charset=utf-8", { "cache-control": "public, max-age=31536000, immutable" });
    if (req.method === "GET" && url.pathname === "/health") return send(res, 200, { ok: true, version: "0.3.0", payment: true, adminUsers: true });
    if (req.method === "POST" && url.pathname === "/api/register") {
      const input = await readJson(req); const email = String(input.email || "").trim().toLowerCase();
      if (!/^\S+@\S+\.\S+$/.test(email) || String(input.password || "").length < 8) return send(res, 400, { error: "邮箱无效或密码少于8位" });
      if (db.users.some(u => u.email === email)) return send(res, 409, { error: "邮箱已注册" });
      const user = { id: id(), email, passwordHash: passwordHash(input.password), role: "user", status: "pending", createdAt: new Date().toISOString() };
      db.users.push(user); audit(email, "register"); saveDb(); return loginResponse(res, user);
    }
    if (req.method === "POST" && url.pathname === "/api/login") {
      const input = await readJson(req); const email = String(input.email || "").trim().toLowerCase();
      let user = db.users.find(u => u.email === email && passwordOk(String(input.password || ""), u.passwordHash));
      if (!user && email === adminUser.toLowerCase() && input.password === adminPassword) {
        user = db.users.find(u => u.role === "admin");
        if (!user) { user = { id: id(), email: adminUser, passwordHash: passwordHash(adminPassword), role: "admin", status: "active", createdAt: new Date().toISOString() }; db.users.push(user); saveDb(); }
      }
      if (!user) return send(res, 401, { error: "账号或密码错误" });
      return loginResponse(res, user);
    }
    if (req.method === "POST" && url.pathname === "/api/logout") {
      const token = (req.headers.cookie || "").split(";").map(x => x.trim()).find(x => x.startsWith("portal_session="))?.slice(15);
      if (token) db.sessions = db.sessions.filter(s => s.tokenHash !== hash(token)); saveDb();
      return send(res, 200, { ok: true }, undefined, { "set-cookie": "portal_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" });
    }
    if (req.method === "GET" && url.pathname === "/api/payment/notify") {
      const values = Object.fromEntries(url.searchParams.entries());
      if (String(values.pid || "") !== paymentPid || !values.sign || !safeEqualText(paymentSign(values), values.sign)) return send(res, 400, "fail", "text/plain; charset=utf-8");
      const payment = db.payments.find(item => item.id === String(values.out_trade_no || ""));
      if (!payment || String(values.trade_status || "") !== "TRADE_SUCCESS" || Number(values.money) !== Number((payment.amount / 100).toFixed(2))) return send(res, 400, "fail", "text/plain; charset=utf-8");
      if (payment.status !== "paid") {
        const target = db.users.find(item => item.id === payment.userId);
        if (!target) return send(res, 400, "fail", "text/plain; charset=utf-8");
        target.balance = Number(target.balance || 0) + payment.amount;
        payment.status = "paid"; payment.tradeNo = String(values.trade_no || ""); payment.type = String(values.type || ""); payment.paidAt = new Date().toISOString();
        audit(target.email, "payment_received", `${payment.id}:${payment.amount}`); saveDb();
      }
      return send(res, 200, "success", "text/plain; charset=utf-8");
    }
    if (req.method === "GET" && url.pathname === "/api/me") return send(res, 200, { user: currentUser(req) ? safeUser(currentUser(req)) : null, products: db.products });
    const user = currentUser(req); if (!user) return send(res, 401, { error: "请先登录" });
    if (req.method === "POST" && url.pathname === "/api/payment/create") {
      if (user.role === "admin") return send(res, 400, { error: "管理员账号不能充值" });
      const input = await readJson(req); const amountYuan = Number(input.amount); const type = String(input.type || "cashier");
      if (!Number.isFinite(amountYuan) || amountYuan < 1 || amountYuan > 10000 || !["cashier", "alipay", "wxpay", "usdt"].includes(type)) return send(res, 400, { error: "充值金额或支付方式无效" });
      const amount = Math.round(amountYuan * 100); const orderNo = `P${Date.now()}${crypto.randomBytes(4).toString("hex")}`;
      const fields = { pid: paymentPid, out_trade_no: orderNo, notify_url: `${publicBase}/api/payment/notify`, return_url: `${publicBase}/?payment=return&order=${orderNo}`, name: "账户余额充值", money: (amount / 100).toFixed(2), param: user.id };
      if (type !== "cashier") fields.type = type;
      const sign = paymentSign(fields);
      db.payments.unshift({ id: orderNo, userId: user.id, amount, type, status: "pending", createdAt: new Date().toISOString() }); db.payments = db.payments.slice(0, 2000); saveDb();
      return send(res, 200, { action: `${paymentBase}/submit.php`, fields: { ...fields, sign, sign_type: "MD5" } });
    }
    if (req.method === "GET" && url.pathname === "/api/payment/status") {
      const orderNo = String(url.searchParams.get("order") || ""); const payment = db.payments.find(item => item.id === orderNo && item.userId === user.id);
      return payment ? send(res, 200, { id: payment.id, amount: payment.amount, status: payment.status, createdAt: payment.createdAt, paidAt: payment.paidAt || "" }) : send(res, 404, { error: "充值订单不存在" });
    }
    if (req.method === "GET" && url.pathname === "/api/payment/orders") return send(res, 200, { payments: db.payments.filter(item => item.userId === user.id).slice(0, 10).map(item => ({ id: item.id, amount: item.amount, type: item.type, status: item.status, createdAt: item.createdAt, paidAt: item.paidAt || "" })) });
    if (req.method === "GET" && url.pathname === "/api/subscription-qr") {
      if (!user.subscriptionUrl) return send(res, 404, "订阅尚未开通", "text/plain; charset=utf-8");
      const qr = qrcode(0, "M"); qr.addData(user.subscriptionUrl); qr.make();
      return send(res, 200, qr.createSvgTag({ cellSize: 5, margin: 4, scalable: true }), "image/svg+xml; charset=utf-8", { "content-security-policy": "default-src 'none'", "cache-control": "no-store, private" });
    }
    if (req.method === "GET" && url.pathname === "/api/nodes") {
      const data = await workerCall("/api/nodes"); return send(res, 200, data);
    }
    if (req.method === "POST" && url.pathname === "/api/purchase") {
      if (user.role === "admin") return send(res, 400, { error: "管理员账号不能购买套餐" });
      const input = await readJson(req); const product = db.products.find(p => p.id === String(input.plan || ""));
      const selectedNodeIds = Array.from(new Set((input.selectedNodeIds || []).map(Number).filter(Number.isInteger)));
      const requestedMonths = Number(input.months || 1);
      const allowedMonths = product?.id === "two_day_trial" ? [1] : [1, 3, 6, 12];
      if (!product || !selectedNodeIds.length || selectedNodeIds.length > product.nodes) return send(res, 400, { error: "套餐或节点选择无效" });
      if (!allowedMonths.includes(requestedMonths)) return send(res, 400, { error: "购买时长无效" });
      if (product.id === "two_day_trial" && (user.twoDayTrialUsed || user.subscriptionUrl || user.planId)) return send(res, 400, { error: "2 天试用仅限未开通服务的新账号领取一次" });
      const amount = Math.round(product.price * requestedMonths * (requestedMonths >= 6 ? 0.8 : 1));
      if (Number(user.balance || 0) < amount) return send(res, 400, { error: "余额不足" });
      const startsAt = Math.max(Date.now(), Date.parse(user.expiresAt || "") || 0);
      const expiresAt = new Date(startsAt + product.days * requestedMonths * 86400000).toISOString();
      const { created, cleanup } = await replaceWorkerService(user, { name: user.email, upstreamId: workerUpstreamId, expiresAt, nodeLimit: product.nodes, selectedNodeIds, pool: true });
      user.balance = Number(user.balance || 0) - amount; user.subscriptionUrl = created.subscriptionUrl; user.status = "active"; user.expiresAt = expiresAt; user.planId = product.id; user.workerUserId = created.id; user.selectedNodeIds = selectedNodeIds; if (product.id === "two_day_trial") user.twoDayTrialUsed = true;
      db.orders.unshift({ id: id(), userId: user.id, planId: product.id, months: requestedMonths, amount, selectedNodeIds, status: "paid_balance", createdAt: new Date().toISOString() });
      audit(user.email, "balance_purchase", `${product.id}:${requestedMonths}m:${amount}:dns_removed=${cleanup.removed || 0}:dns_failed=${cleanup.failed || 0}`); saveDb(); return send(res, 200, { ok: true, subscriptionUrl: user.subscriptionUrl, expiresAt, balance: user.balance, amount, months: requestedMonths, oldDnsRemoved: cleanup.removed || 0, oldDnsFailed: cleanup.failed || 0 });
    }
    if (url.pathname.startsWith("/api/admin/") && user.role !== "admin") return send(res, 403, { error: "无管理员权限" });
    if (req.method === "GET" && url.pathname === "/api/admin/users") return send(res, 200, { users: db.users.filter(u => u.role !== "admin").map(safeUser) });
    const accessMatch = url.pathname.match(/^\/api\/admin\/users\/([a-f0-9]+)\/accesses$/);
    if (req.method === "GET" && accessMatch) {
      const target = db.users.find(item => item.id === accessMatch[1] && item.role !== "admin");
      if (!target) return send(res, 404, { error: "用户不存在" });
      if (!target.workerUserId) return send(res, 200, { summary: { devices_24h: 0, devices_7d: 0, hits_7d: 0, last_seen_at: null }, recent: [] });
      const data = await workerCall(`/api/users/${Number(target.workerUserId)}/accesses`);
      return send(res, 200, data);
    }
    const balanceMatch = url.pathname.match(/^\/api\/admin\/users\/([a-f0-9]+)\/balance$/);
    if (req.method === "POST" && balanceMatch) {
      const input = await readJson(req); const target = db.users.find(u => u.id === balanceMatch[1]);
      const balanceYuan = Number(input.balanceYuan);
      if (!target || !Number.isFinite(balanceYuan) || balanceYuan < 0 || balanceYuan > 1000000) return send(res, 400, { error: "用户或余额无效" });
      target.balance = Math.round(balanceYuan * 100); audit(user.email, "set_balance", `${target.email}:${target.balance}`); saveDb();
      return send(res, 200, { ok: true, balance: target.balance });
    }
    const deleteUserMatch = url.pathname.match(/^\/api\/admin\/users\/([a-f0-9]+)\/delete$/);
    if (req.method === "POST" && deleteUserMatch) {
      const target = db.users.find(item => item.id === deleteUserMatch[1] && item.role !== "admin");
      if (!target) return send(res, 404, { error: "用户不存在" });
      let cleanup = { removed: 0, failed: 0 };
      if (target.workerUserId) cleanup = await workerCall(`/api/users/${Number(target.workerUserId)}/disable`, { method: "POST" });
      if (Number(cleanup.failed || 0) > 0) return send(res, 502, { error: `仍有 ${cleanup.failed} 条 DNS 清理失败，暂未删除用户，请稍后重试` });
      db.sessions = db.sessions.filter(item => item.userId !== target.id);
      db.orders.forEach(item => { if (item.userId === target.id) item.deletedUserEmail = target.email; });
      db.payments.forEach(item => { if (item.userId === target.id) item.deletedUserEmail = target.email; });
      db.users = db.users.filter(item => item.id !== target.id);
      audit(user.email, "delete_user", `${target.email}:dns_removed=${cleanup.removed || 0}`); saveDb();
      return send(res, 200, { ok: true, removedDns: cleanup.removed || 0 });
    }
    const provisionMatch = url.pathname.match(/^\/api\/admin\/users\/([a-f0-9]+)\/provision$/);
    if (req.method === "POST" && provisionMatch) {
      const input = await readJson(req); const target = db.users.find(u => u.id === provisionMatch[1]);
      if (!target) return send(res, 404, { error: "用户不存在" });
      const product = db.products.find(p => p.id === String(input.plan || "standard"));
      if (!product) return send(res, 400, { error: "套餐不存在" });
      const expiresAt = new Date(Date.now() + product.days * 86400000).toISOString();
      const { created, cleanup } = await replaceWorkerService(target, { name: target.email, upstreamId: workerUpstreamId, expiresAt, nodeLimit: product.nodes });
      target.subscriptionUrl = created.subscriptionUrl; target.status = "active"; target.expiresAt = expiresAt; target.planId = product.id; target.workerUserId = created.id;
      audit(user.email, "auto_provision", `${target.email}:${product.id}:dns_removed=${cleanup.removed || 0}:dns_failed=${cleanup.failed || 0}`); saveDb();
      return send(res, 200, { ok: true, subscriptionUrl: target.subscriptionUrl, expiresAt, nodes: product.nodes, oldDnsRemoved: cleanup.removed || 0, oldDnsFailed: cleanup.failed || 0 });
    }
    const serviceMatch = url.pathname.match(/^\/api\/admin\/users\/([a-f0-9]+)\/service$/);
    if (req.method === "POST" && serviceMatch) {
      const input = await readJson(req); const target = db.users.find(u => u.id === serviceMatch[1]);
      if (!target || !/^https:\/\//.test(String(input.subscriptionUrl || ""))) return send(res, 400, { error: "用户或订阅地址无效" });
      target.subscriptionUrl = String(input.subscriptionUrl); target.status = "active"; target.expiresAt = new Date(Date.now() + Math.max(1, Number(input.days || 30)) * 86400000).toISOString();
      audit(user.email, "set_service", target.email); saveDb(); return send(res, 200, { ok: true });
    }
    if (req.method === "POST" && url.pathname === "/api/admin/invites") {
      const input = await readJson(req); const code = String(input.code || "").trim();
      if (code.length < 6 || db.invites.some(i => i.code === code)) return send(res, 400, { error: "邀请码至少6位且不可重复" });
      db.invites.push({ code, maxUses: Math.max(1, Number(input.maxUses || 1)), uses: 0, enabled: true }); audit(user.email, "create_invite", code); saveDb(); return send(res, 201, { ok: true });
    }
    return send(res, 404, { error: "Not Found" });
  } catch (error) { console.error(error); return send(res, 500, { error: "服务器错误" }); }
});

function loginResponse(res, user) {
  const token = crypto.randomBytes(32).toString("base64url");
  db.sessions.push({ tokenHash: hash(token), userId: user.id, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString() }); saveDb();
  return send(res, 200, { user: safeUser(user) }, undefined, { "set-cookie": `portal_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800` });
}

server.listen(port, "127.0.0.1", () => console.log(`dns-share-portal listening on ${port}`));
