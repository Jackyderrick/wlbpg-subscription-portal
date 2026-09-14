import { connectionIdentity, dnsType, encodeSubscription, parseSubscription, rewriteNode } from "./parser";

type Env = {
  DB: D1Database;
  DNS_SUFFIX: string;
  CF_ZONE_ID: string;
  DNS_POOLS?: string;
  CF_API_TOKEN: string;
  ADMIN_SECRET: string;
  ACCESS_LOG_SALT?: string;
  PAYMENT_API_BASE?: string;
  PAYMENT_PID?: string;
  PAYMENT_KEY?: string;
  PUBLIC_BASE_URL?: string;
};

type DbUser = { id: number; name: string; upstream_id: number; expires_at: string; status: string; node_limit: number; dns_revision: number };
type DbNode = { id: number; fingerprint: string; name: string; protocol: string; original_server: string; original_uri: string };
type PoolNode = DbNode & { source_name: string; upstream_id: number };
type DnsRow = { id: number; hostname: string; cloudflare_record_id: string | null; zone_id: string | null };
type SubscriptionUser = { id: number; status: string; expires_at: string };
type DnsPool = { suffix: string; zoneId: string; maxRecords: number };
type AppPlan = { id: string; name: string; amountCents: number; currency: string; days: number; nodeLimit: number; trafficGb: number | null };
type AppSession = { user_id: number; device_id: number; expires_at: string; revoked_at: string | null };
type AppOrder = { id: number; order_no: string; user_id: number; plan_id: string; status: string; amount_cents: number; currency: string; metadata_json?: string };
type PaidAppOrder = { plan_id: string; amount_cents: number; currency: string; updated_at: string };

const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const encoder = new TextEncoder();
const appPlans: AppPlan[] = [
  { id: "test_cny_1", name: "1 yuan test", amountCents: 100, currency: "CNY", days: 30, nodeLimit: 5, trafficGb: 100 },
];

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}

async function body<T>(request: Request): Promise<T> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 1_000_000) throw new Error("请求内容过大");
  return request.json<T>();
}

async function hash(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

function utcDay(value = new Date()): string {
  return value.toISOString().slice(0, 10);
}

function deviceKind(userAgent: string): string {
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "iOS";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Windows/i.test(userAgent)) return "Windows";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "macOS";
  if (/Linux/i.test(userAgent)) return "Linux";
  return "其他";
}

async function recordSubscriptionAccess(request: Request, env: Env, userId: number): Promise<void> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const userAgent = request.headers.get("User-Agent") ?? "";
  const day = utcDay();
  // Store only a daily, salted pseudonymous fingerprint. Raw IP addresses and
  // full user agents never reach D1, and fingerprints cannot link activity
  // across different days.
  const salt = env.ACCESS_LOG_SALT || `${env.ADMIN_SECRET}|subscription-access`;
  const fingerprint = await hash(`${salt}|${day}|${ip}|${userAgent}`);
  const country = request.cf?.country ? String(request.cf.country).slice(0, 2) : "";
  await env.DB.prepare(`INSERT INTO subscription_access_daily
    (user_id,access_date,fingerprint,device_kind,country,first_seen_at,last_seen_at,hits)
    VALUES(?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,1)
    ON CONFLICT(user_id,access_date,fingerprint) DO UPDATE SET
      last_seen_at=CURRENT_TIMESTAMP,hits=hits+1,country=excluded.country,device_kind=excluded.device_kind`)
    .bind(userId, day, fingerprint, deviceKind(userAgent), country).run();
}

async function accessSummary(env: Env, userId: number): Promise<Record<string, unknown>> {
  const [summary, recent] = await Promise.all([
    env.DB.prepare(`SELECT
      COUNT(DISTINCT CASE WHEN access_date>=date('now','-1 day') THEN fingerprint END) AS devices_24h,
      COUNT(DISTINCT fingerprint) AS devices_7d,
      MAX(last_seen_at) AS last_seen_at,
      COALESCE(SUM(hits),0) AS hits_7d
      FROM subscription_access_daily
      WHERE user_id=? AND access_date>=date('now','-6 day')`).bind(userId).first(),
    env.DB.prepare(`SELECT access_date,device_kind,country,first_seen_at,last_seen_at,hits
      FROM subscription_access_daily WHERE user_id=? AND access_date>=date('now','-6 day')
      ORDER BY last_seen_at DESC LIMIT 30`).bind(userId).all(),
  ]);
  return { summary: summary ?? { devices_24h: 0, devices_7d: 0, last_seen_at: null, hits_7d: 0 }, recent: recent.results };
}

function randomToken(bytes = 24): string {
  const data = crypto.getRandomValues(new Uint8Array(bytes));
  return btoa(String.fromCharCode(...data)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function secureEqual(a: string, b: string): Promise<boolean> {
  const [ah, bh] = await Promise.all([hash(a), hash(b)]);
  let diff = 0;
  for (let i = 0; i < ah.length; i++) diff |= ah.charCodeAt(i) ^ bh.charCodeAt(i);
  return diff === 0;
}

async function authorized(request: Request, env: Env): Promise<boolean> {
  const supplied = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  return secureEqual(supplied, env.ADMIN_SECRET);
}

function appPublicBase(request: Request, env: Env): string {
  return (env.PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/$/, "");
}

function appPaymentBase(env: Env): string {
  return (env.PAYMENT_API_BASE || "").replace(/\/$/, "");
}

function appPaymentConfigured(env: Env): boolean {
  return Boolean(appPaymentBase(env) && env.PAYMENT_PID && env.PAYMENT_KEY);
}

function appPaymentSign(env: Env, values: Record<string, string>): string {
  const source = Object.entries(values)
    .filter(([key, value]) => key !== "sign" && key !== "sign_type" && value !== "")
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return md5(`${source}${env.PAYMENT_KEY || ""}`);
}

function md5(value: string): string {
  // Cloudflare Workers expose Web Crypto but not MD5.  This compact fallback is
  // used only for EPay-compatible signatures.
  function add32(a: number, b: number) { return (a + b) & 0xffffffff; }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
  function md5cycle(state: number[], block: number[]) {
    let [a, b, c, d] = state;
    a = ff(a, b, c, d, block[0], 7, -680876936); d = ff(d, a, b, c, block[1], 12, -389564586); c = ff(c, d, a, b, block[2], 17, 606105819); b = ff(b, c, d, a, block[3], 22, -1044525330);
    a = ff(a, b, c, d, block[4], 7, -176418897); d = ff(d, a, b, c, block[5], 12, 1200080426); c = ff(c, d, a, b, block[6], 17, -1473231341); b = ff(b, c, d, a, block[7], 22, -45705983);
    a = ff(a, b, c, d, block[8], 7, 1770035416); d = ff(d, a, b, c, block[9], 12, -1958414417); c = ff(c, d, a, b, block[10], 17, -42063); b = ff(b, c, d, a, block[11], 22, -1990404162);
    a = ff(a, b, c, d, block[12], 7, 1804603682); d = ff(d, a, b, c, block[13], 12, -40341101); c = ff(c, d, a, b, block[14], 17, -1502002290); b = ff(b, c, d, a, block[15], 22, 1236535329);
    a = gg(a, b, c, d, block[1], 5, -165796510); d = gg(d, a, b, c, block[6], 9, -1069501632); c = gg(c, d, a, b, block[11], 14, 643717713); b = gg(b, c, d, a, block[0], 20, -373897302);
    a = gg(a, b, c, d, block[5], 5, -701558691); d = gg(d, a, b, c, block[10], 9, 38016083); c = gg(c, d, a, b, block[15], 14, -660478335); b = gg(b, c, d, a, block[4], 20, -405537848);
    a = gg(a, b, c, d, block[9], 5, 568446438); d = gg(d, a, b, c, block[14], 9, -1019803690); c = gg(c, d, a, b, block[3], 14, -187363961); b = gg(b, c, d, a, block[8], 20, 1163531501);
    a = gg(a, b, c, d, block[13], 5, -1444681467); d = gg(d, a, b, c, block[2], 9, -51403784); c = gg(c, d, a, b, block[7], 14, 1735328473); b = gg(b, c, d, a, block[12], 20, -1926607734);
    a = hh(a, b, c, d, block[5], 4, -378558); d = hh(d, a, b, c, block[8], 11, -2022574463); c = hh(c, d, a, b, block[11], 16, 1839030562); b = hh(b, c, d, a, block[14], 23, -35309556);
    a = hh(a, b, c, d, block[1], 4, -1530992060); d = hh(d, a, b, c, block[4], 11, 1272893353); c = hh(c, d, a, b, block[7], 16, -155497632); b = hh(b, c, d, a, block[10], 23, -1094730640);
    a = hh(a, b, c, d, block[13], 4, 681279174); d = hh(d, a, b, c, block[0], 11, -358537222); c = hh(c, d, a, b, block[3], 16, -722521979); b = hh(b, c, d, a, block[6], 23, 76029189);
    a = hh(a, b, c, d, block[9], 4, -640364487); d = hh(d, a, b, c, block[12], 11, -421815835); c = hh(c, d, a, b, block[15], 16, 530742520); b = hh(b, c, d, a, block[2], 23, -995338651);
    a = ii(a, b, c, d, block[0], 6, -198630844); d = ii(d, a, b, c, block[7], 10, 1126891415); c = ii(c, d, a, b, block[14], 15, -1416354905); b = ii(b, c, d, a, block[5], 21, -57434055);
    a = ii(a, b, c, d, block[12], 6, 1700485571); d = ii(d, a, b, c, block[3], 10, -1894986606); c = ii(c, d, a, b, block[10], 15, -1051523); b = ii(b, c, d, a, block[1], 21, -2054922799);
    a = ii(a, b, c, d, block[8], 6, 1873313359); d = ii(d, a, b, c, block[15], 10, -30611744); c = ii(c, d, a, b, block[6], 15, -1560198380); b = ii(b, c, d, a, block[13], 21, 1309151649);
    a = ii(a, b, c, d, block[4], 6, -145523070); d = ii(d, a, b, c, block[11], 10, -1120210379); c = ii(c, d, a, b, block[2], 15, 718787259); b = ii(b, c, d, a, block[9], 21, -343485551);
    state[0] = add32(state[0], a); state[1] = add32(state[1], b); state[2] = add32(state[2], c); state[3] = add32(state[3], d);
  }
  const bytes = Array.from(new TextEncoder().encode(value));
  const originalBits = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 0; i < 8; i++) bytes.push(Math.floor(originalBits / 2 ** (8 * i)) & 0xff);
  const state = [1732584193, -271733879, -1732584194, 271733878];
  for (let i = 0; i < bytes.length; i += 64) {
    const block = Array.from({ length: 16 }, (_, j) => bytes[i + j * 4] | (bytes[i + j * 4 + 1] << 8) | (bytes[i + j * 4 + 2] << 16) | (bytes[i + j * 4 + 3] << 24));
    md5cycle(state, block);
  }
  return state.flatMap(n => [n & 255, (n >>> 8) & 255, (n >>> 16) & 255, (n >>> 24) & 255]).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function appSession(request: Request, env: Env): Promise<AppSession | null> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim() ?? "";
  if (!token) return null;
  const session = await env.DB.prepare("SELECT user_id,device_id,expires_at,revoked_at FROM app_sessions WHERE token_hash=?").bind(await hash(token)).first<AppSession>();
  if (!session || session.revoked_at || Date.parse(session.expires_at) <= Date.now()) return null;
  await env.DB.prepare("UPDATE app_sessions SET last_seen_at=CURRENT_TIMESTAMP WHERE token_hash=?").bind(await hash(token)).run();
  return session;
}

async function requireAppSession(request: Request, env: Env): Promise<AppSession | Response> {
  const session = await appSession(request, env);
  return session ?? json({ error: "unauthorized" }, 401);
}

function appPaymentFields(request: Request, env: Env, order: AppOrder, plan: AppPlan): Record<string, string> {
  const base = appPublicBase(request, env);
  const fields: Record<string, string> = {
    pid: String(env.PAYMENT_PID || ""),
    out_trade_no: order.order_no,
    notify_url: `${base}/api/app/payment/notify`,
    return_url: `${base}/api/app/payment/return?order=${encodeURIComponent(order.order_no)}`,
    name: plan.name,
    money: (order.amount_cents / 100).toFixed(2),
    param: String(order.user_id),
  };
  const metadata = safeJsonParse<Record<string, string>>(String((order as unknown as { metadata_json?: string }).metadata_json || "{}"), {});
  const payType = metadata.paymentType || "";
  if (["alipay", "wxpay"].includes(payType)) fields.type = payType;
  fields.sign = appPaymentSign(env, fields);
  fields.sign_type = "MD5";
  return fields;
}

function safeJsonParse<T>(value: string, fallback: T): T {
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

function dnsPools(env: Env): DnsPool[] {
  const fallback = [{ suffix: env.DNS_SUFFIX, zoneId: env.CF_ZONE_ID, maxRecords: 190 }];
  try {
    const parsed = JSON.parse(env.DNS_POOLS || "[]") as DnsPool[];
    const pools = parsed.filter(pool => /^[a-z0-9.-]+$/i.test(pool.suffix) && /^[a-f0-9]{32}$/i.test(pool.zoneId) && Number.isInteger(pool.maxRecords) && pool.maxRecords > 0);
    return pools.length ? pools : fallback;
  } catch { return fallback; }
}

function localizedNodeName(name: string, upstreamId: number): string {
  const countries: Array<[string, string]> = [
    ["United States", "美国"], ["Malaysia", "马来西亚"], ["Singapore", "新加坡"],
    ["Japan", "日本"], ["Korea", "韩国"], ["Netherlands", "荷兰"],
    ["United Kingdom", "英国"], ["Hong Kong", "香港"], ["Taiwan", "台湾"], ["Germany", "德国"],
  ];
  const flag = name.match(/^\p{Regional_Indicator}{2}/u)?.[0] ?? "";
  const rest = name.slice(flag.length).trim();
  for (const [english, chinese] of countries) {
    if (rest.startsWith(english)) {
      const suffix = rest.slice(english.length).trim();
      return `节点 · ${flag}${chinese}${suffix ? ` ${suffix}` : ""}${upstreamId === 2 ? " · 线路二" : ""}`;
    }
  }
  return `节点 · ${flag}${rest}${upstreamId === 2 ? " · 线路二" : ""}`;
}

async function cfDns(env: Env, zoneId: string, method: string, path = "", payload?: unknown): Promise<Record<string, unknown>> {
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records${path}`, {
    method,
    headers: { authorization: `Bearer ${env.CF_API_TOKEN}`, "content-type": "application/json" },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });
  const result = await response.json<Record<string, unknown>>();
  if (!response.ok || result.success !== true) throw new Error(`Cloudflare DNS 请求失败：${JSON.stringify(result.errors ?? response.status)}`);
  return result;
}

async function createDns(env: Env, pool: DnsPool, hostname: string, server: string): Promise<string> {
  const result = await cfDns(env, pool.zoneId, "POST", "", { type: dnsType(server), name: hostname, content: server, ttl: 60, proxied: false, comment: "dns-sub-share managed" });
  return String((result.result as { id?: string } | undefined)?.id ?? "");
}

async function deleteDns(env: Env, zoneId: string, recordId: string): Promise<void> {
  if (recordId) await cfDns(env, zoneId, "DELETE", `/${recordId}`);
}

async function pickDnsPool(env: Env): Promise<DnsPool> {
  const pools = dnsPools(env);
  const usage = await env.DB.prepare("SELECT COALESCE(zone_id, ?) zone_id, COUNT(*) total FROM user_dns_records WHERE status IN ('active','error','pending') GROUP BY COALESCE(zone_id, ?)").bind(env.CF_ZONE_ID, env.CF_ZONE_ID).all<{ zone_id: string; total: number }>();
  const counts = new Map(usage.results.map(row => [row.zone_id, Number(row.total)]));
  const available = pools.filter(pool => (counts.get(pool.zoneId) || 0) < pool.maxRecords);
  if (!available.length) throw new Error("所有节点域名池均已达到容量上限");
  return available.sort((a, b) => ((counts.get(a.zoneId) || 0) / a.maxRecords) - ((counts.get(b.zoneId) || 0) / b.maxRecords))[0];
}

async function syncUpstream(env: Env, upstreamId: number): Promise<{ found: number }> {
  const upstream = await env.DB.prepare("SELECT subscription_url FROM upstreams WHERE id=? AND enabled=1").bind(upstreamId).first<{ subscription_url: string }>();
  if (!upstream) throw new Error("上游不存在或已停用");
  try {
    const response = await fetch(upstream.subscription_url, { headers: { "user-agent": "dns-sub-share/0.1" }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`上游返回 HTTP ${response.status}`);
    const text = await response.text();
    if (text.length > 5_000_000) throw new Error("上游订阅超过 5 MB");
    const nodes = await parseSubscription(text);
    if (!nodes.length) throw new Error("未解析到支持的节点");
    await env.DB.batch([
      env.DB.prepare("UPDATE nodes SET active=0 WHERE upstream_id=?").bind(upstreamId),
      ...nodes.map(node => env.DB.prepare(`INSERT INTO nodes(upstream_id,fingerprint,name,protocol,original_server,original_uri,active,updated_at)
        VALUES(?,?,?,?,?,?,1,CURRENT_TIMESTAMP)
        ON CONFLICT(upstream_id,fingerprint) DO UPDATE SET name=excluded.name,protocol=excluded.protocol,original_server=excluded.original_server,original_uri=excluded.original_uri,active=1,updated_at=CURRENT_TIMESTAMP`)
        .bind(upstreamId, node.fingerprint, localizedNodeName(node.name, upstreamId), node.protocol, node.server, node.originalUri)),
    ]);
    await env.DB.prepare("UPDATE upstreams SET last_synced_at=CURRENT_TIMESTAMP,last_error=NULL WHERE id=?").bind(upstreamId).run();
    return { found: nodes.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await env.DB.prepare("UPDATE upstreams SET last_error=? WHERE id=?").bind(message, upstreamId).run();
    throw error;
  }
}

async function reconcileUpstream(env: Env, upstreamId: number): Promise<void> {
  const stale = await env.DB.prepare(`SELECT d.id,d.cloudflare_record_id,d.zone_id FROM user_dns_records d JOIN nodes n ON n.id=d.node_id
    WHERE n.upstream_id=? AND n.active=0 AND d.status='active'`).bind(upstreamId).all<{ id: number; cloudflare_record_id: string | null; zone_id: string | null }>();
  for (const row of stale.results) {
    try {
      await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
      await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(row.id).run();
    } catch (error) {
      await env.DB.prepare("UPDATE user_dns_records SET status='error',last_error=? WHERE id=?").bind(error instanceof Error ? error.message : String(error), row.id).run();
    }
  }
  // Existing users continue to follow their original upstream.  A user who
  // deliberately selected a node from this source is also reconciled, which
  // keeps the new merged pool healthy when either source changes.
  const users = await env.DB.prepare(`SELECT DISTINCT u.id,u.name,u.upstream_id,u.expires_at,u.status,u.node_limit,u.dns_revision
    FROM users u
    WHERE u.status='active' AND u.expires_at>datetime('now') AND (
      u.upstream_id=? OR EXISTS(
        SELECT 1 FROM user_selected_nodes s JOIN nodes n ON n.id=s.node_id
        WHERE s.user_id=u.id AND n.upstream_id=?
      )
    )`).bind(upstreamId, upstreamId).all<DbUser>();
  for (const user of users.results) await provisionUser(env, user);
}

async function syncAllUpstreams(env: Env): Promise<number> {
  const rows = await env.DB.prepare("SELECT id FROM upstreams WHERE enabled=1").all<{ id: number }>();
  for (const row of rows.results) {
    try {
      await syncUpstream(env, row.id);
      await reconcileUpstream(env, row.id);
    } catch (error) {
      console.error(JSON.stringify({ event: "upstream_sync_error", upstreamId: row.id, error: error instanceof Error ? error.message : String(error) }));
    }
  }
  return rows.results.length;
}

async function provisionUser(env: Env, user: DbUser): Promise<{ created: number; failed: number }> {
  const selected = await env.DB.prepare("SELECT node_id FROM user_selected_nodes WHERE user_id=?").bind(user.id).all<{ node_id: number }>();
  const selectedIds = selected.results.map(row => row.node_id);
  const nodes = selectedIds.length
    ? await env.DB.prepare(`SELECT id,fingerprint,name,protocol,original_server,original_uri FROM nodes WHERE active=1 AND id IN (${selectedIds.map(() => "?").join(",")}) ORDER BY id`).bind(...selectedIds).all<DbNode>()
    : await env.DB.prepare("SELECT id,fingerprint,name,protocol,original_server,original_uri FROM nodes WHERE upstream_id=? AND active=1 ORDER BY id LIMIT ?").bind(user.upstream_id, Math.max(1, Math.min(20, user.node_limit || 5))).all<DbNode>();
  let created = 0, failed = 0;
  for (const node of nodes.results) {
    const existing = await env.DB.prepare("SELECT id,status FROM user_dns_records WHERE user_id=? AND node_id=?").bind(user.id, node.id).first<{ id: number; status: string }>();
    if (existing?.status === "active") continue;
    // Node IDs make labels unique across two upstreams even when their
    // provider-generated fingerprint happens to be identical.
    const label = `u${user.id}-r${user.dns_revision}-${node.fingerprint.slice(0, 10)}-${node.id}`;
    const pool = await pickDnsPool(env);
    const hostname = `${label}.${pool.suffix}`;
    try {
      const recordId = await createDns(env, pool, hostname, node.original_server);
      await env.DB.prepare(`INSERT INTO user_dns_records(user_id,node_id,hostname,record_type,record_content,cloudflare_record_id,zone_id,status,last_error)
        VALUES(?,?,?,?,?,?,?, 'active',NULL)
        ON CONFLICT(user_id,node_id) DO UPDATE SET hostname=excluded.hostname,record_type=excluded.record_type,record_content=excluded.record_content,cloudflare_record_id=excluded.cloudflare_record_id,zone_id=excluded.zone_id,status='active',last_error=NULL`)
        .bind(user.id, node.id, hostname, dnsType(node.original_server), node.original_server, recordId, pool.zoneId).run();
      created++;
    } catch (error) {
      failed++;
      const message = error instanceof Error ? error.message : String(error);
      await env.DB.prepare(`INSERT INTO user_dns_records(user_id,node_id,hostname,record_type,record_content,zone_id,status,last_error)
        VALUES(?,?,?,?,?,?,'error',?) ON CONFLICT(user_id,node_id) DO UPDATE SET status='error',last_error=excluded.last_error,zone_id=excluded.zone_id`)
        .bind(user.id, node.id, hostname, dnsType(node.original_server), node.original_server, pool.zoneId, message).run();
    }
  }
  return { created, failed };
}

async function deprovisionUser(env: Env, userId: number): Promise<{ removed: number; failed: number }> {
  const rows = await env.DB.prepare("SELECT id,hostname,cloudflare_record_id,zone_id FROM user_dns_records WHERE user_id=? AND status IN ('active','error')").bind(userId).all<DnsRow>();
  let removed = 0, failed = 0;
  for (const row of rows.results) {
    try {
      await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "");
      await env.DB.prepare("UPDATE user_dns_records SET status='deleted',cloudflare_record_id=NULL,last_error=NULL WHERE id=?").bind(row.id).run();
      removed++;
    } catch (error) {
      failed++;
      await env.DB.prepare("UPDATE user_dns_records SET status='error',last_error=? WHERE id=?").bind(error instanceof Error ? error.message : String(error), row.id).run();
    }
  }
  return { removed, failed };
}

async function expireUsers(env: Env): Promise<number> {
  const users = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE status='active' AND expires_at<=datetime('now')").all<DbUser>();
  for (const user of users.results) {
    await deprovisionUser(env, user.id);
    await env.DB.prepare("UPDATE users SET status='expired' WHERE id=?").bind(user.id).run();
  }
  return users.results.length;
}

async function appUserPayload(request: Request, env: Env, userId: number, deviceId?: number): Promise<Record<string, unknown>> {
  const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(userId).first<DbUser>();
  if (!user) return { error: "user_not_found" };
  const paidOrder = await env.DB.prepare(`
    SELECT plan_id,amount_cents,currency,updated_at
    FROM app_orders
    WHERE user_id=? AND status='paid'
    ORDER BY updated_at DESC,id DESC
    LIMIT 1
  `).bind(userId).first<PaidAppOrder>();
  const device = deviceId
    ? await env.DB.prepare("SELECT id,platform,app_version,model,created_at,last_seen_at,subscription_token FROM app_devices WHERE id=?").bind(deviceId).first<Record<string, unknown>>()
    : await env.DB.prepare("SELECT id,platform,app_version,model,created_at,last_seen_at,subscription_token FROM app_devices WHERE user_id=? ORDER BY id DESC LIMIT 1").bind(userId).first<Record<string, unknown>>();
  const token = String(device?.subscription_token || "");
  const expiresAt = user.expires_at;
  const configRevision = String(user.dns_revision ?? 0);
  const activeUntil = Date.parse(expiresAt);
  const paidPlan = paidOrder ? appPlans.find(plan => plan.id === paidOrder.plan_id) : null;
  const isPaid = Boolean(paidOrder && user.status === "active" && Number.isFinite(activeUntil) && activeUntil > Date.now());
  return {
    configRevision,
    dnsRevision: configRevision,
    revision: configRevision,
    user: { id: user.id, name: user.name, status: user.status, expiresAt, nodeLimit: user.node_limit, dnsRevision: configRevision },
    device: device ? {
      id: device.id,
      platform: device.platform,
      appVersion: device.app_version,
      model: device.model,
      createdAt: device.created_at,
      lastSeenAt: device.last_seen_at,
    } : null,
    plan: {
      type: isPaid ? "paid" : "trial",
      id: paidPlan?.id ?? "trial",
      name: paidPlan?.name ?? (isPaid ? "会员套餐" : "基础体验"),
      nodeLimit: user.node_limit,
      expiresAt,
      amountCents: paidOrder?.amount_cents ?? 0,
      currency: paidOrder?.currency ?? "CNY",
      paidAt: paidOrder?.updated_at ?? null,
    },
    membership: { active: isPaid, expiresAt, planId: paidPlan?.id ?? null, planName: paidPlan?.name ?? null },
    traffic: { usedBytes: 0, limitBytes: null },
    subscription: token ? {
      tokenHint: token.slice(0, 8),
      status: user.status,
      expiresAt,
      activeDnsRecords: await activeDnsCount(env, user.id),
      configRevision,
      dnsRevision: configRevision,
      revision: configRevision,
      url: `${appPublicBase(request, env)}/api/subscription/${token}`,
    } : null,
    config: { revision: configRevision, dnsRevision: configRevision },
  };
}

async function activeDnsCount(env: Env, userId: number): Promise<number> {
  const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM user_dns_records WHERE user_id=? AND status='active'").bind(userId).first<{ count: number }>();
  return Number(row?.count || 0);
}

async function appApi(request: Request, env: Env, url: URL): Promise<Response | null> {
  if (request.method === "GET" && url.pathname === "/api/app/plans") {
    return json({ plans: appPlans });
  }

  if (request.method === "POST" && url.pathname === "/api/app/bootstrap") {
    const input = await body<{ device_uuid?: string; platform?: string; app_version?: string; version_code?: number; device_model?: string; android_version?: string }>(request);
    const deviceUUID = String(input.device_uuid || "").trim().toLowerCase();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(deviceUUID)) return json({ error: "invalid_device_uuid" }, 400);
    const deviceHash = await hash(deviceUUID);
    let device = await env.DB.prepare("SELECT id,user_id,subscription_token FROM app_devices WHERE device_uuid_hash=?").bind(deviceHash).first<{ id: number; user_id: number; subscription_token: string | null }>();
    if (!device) {
      const upstream = await env.DB.prepare("SELECT id FROM upstreams WHERE enabled=1 ORDER BY id LIMIT 1").first<{ id: number }>();
      if (!upstream) return json({ error: "no_upstream_available" }, 503);
      const subscriptionToken = randomToken();
      const expiresAt = new Date(Date.now() + 3 * 86400000).toISOString();
      const userResult = await env.DB.prepare("INSERT INTO users(name,token_hash,token_hint,upstream_id,expires_at,node_limit) VALUES(?,?,?,?,?,?)")
        .bind(`App Guest ${subscriptionToken.slice(0, 6)}`, await hash(subscriptionToken), subscriptionToken.slice(0, 8), upstream.id, expiresAt, 5).run();
      const userId = Number(userResult.meta.last_row_id);
      const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(userId).first<DbUser>();
      if (user) await provisionUser(env, user);
      const deviceResult = await env.DB.prepare("INSERT INTO app_devices(user_id,device_uuid_hash,subscription_token,platform,app_version,model) VALUES(?,?,?,?,?,?)")
        .bind(userId, deviceHash, subscriptionToken, String(input.platform || "android"), String(input.app_version || ""), String(input.device_model || "")).run();
      device = { id: Number(deviceResult.meta.last_row_id), user_id: userId, subscription_token: subscriptionToken };
    } else {
      await env.DB.prepare("UPDATE app_devices SET platform=?,app_version=?,model=?,last_seen_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(String(input.platform || "android"), String(input.app_version || ""), String(input.device_model || ""), device.id).run();
    }
    const accessToken = randomToken();
    const sessionExpiresAt = new Date(Date.now() + 30 * 86400000).toISOString();
    await env.DB.prepare("INSERT INTO app_sessions(user_id,device_id,token_hash,expires_at) VALUES(?,?,?,?)")
      .bind(device.user_id, device.id, await hash(accessToken), sessionExpiresAt).run();
    return json({ ...(await appUserPayload(request, env, device.user_id, device.id)), access_token: accessToken, accessTokenExpiresAt: sessionExpiresAt }, 201);
  }

  if (request.method === "GET" && url.pathname === "/api/app/me") {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    return json(await appUserPayload(request, env, session.user_id, session.device_id));
  }

  if (request.method === "POST" && url.pathname === "/api/app/order") {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const input = await body<{ planId?: string; plan_id?: string; plan?: string; paymentType?: string; pay_type?: string; channel?: string }>(request);
    const planId = String(input.planId || input.plan_id || input.plan || "").trim();
    const plan = appPlans.find(item => item.id === planId);
    if (!plan) return json({ error: "invalid_plan" }, 400);
    const paymentType = String(input.paymentType || input.pay_type || input.channel || "cashier").trim();
    if (!["cashier", "alipay", "wxpay"].includes(paymentType)) return json({ error: "invalid_payment_type" }, 400);
    const provider = paymentType === "alipay" ? "alipay" : paymentType === "wxpay" ? "wechat" : "manual";
    const orderNo = `A${Date.now()}${randomToken(4)}`;
    await env.DB.prepare("INSERT INTO app_orders(order_no,user_id,plan_id,provider,status,amount_cents,currency,metadata_json) VALUES(?,?,?,?,?,?,?,?)")
      .bind(orderNo, session.user_id, plan.id, provider, "pending", plan.amountCents, plan.currency, JSON.stringify({ paymentType })).run();
    const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency,metadata_json FROM app_orders WHERE order_no=?").bind(orderNo).first<AppOrder>();
    return json({
      order: order ? appOrderPayload(request, env, order, plan) : null,
      paymentConfigured: appPaymentConfigured(env),
    }, 201);
  }

  const orderMatch = url.pathname.match(/^\/api\/app\/order\/([^/]+)$/);
  if (request.method === "GET" && orderMatch) {
    const session = await requireAppSession(request, env);
    if (session instanceof Response) return session;
    const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency,metadata_json FROM app_orders WHERE order_no=? OR id=?")
      .bind(orderMatch[1], Number(orderMatch[1]) || -1).first<AppOrder>();
    if (!order || order.user_id !== session.user_id) return json({ error: "order_not_found" }, 404);
    const plan = appPlans.find(item => item.id === order.plan_id) || appPlans[0];
    return json({ order: appOrderPayload(request, env, order, plan) });
  }

  return null;
}

function appOrderPayload(request: Request, env: Env, order: AppOrder, plan: AppPlan): Record<string, unknown> {
  const payUrl = `${appPublicBase(request, env)}/app-pay/${encodeURIComponent(order.order_no)}`;
  return {
    id: order.id,
    orderNo: order.order_no,
    planId: order.plan_id,
    status: order.status,
    amountCents: order.amount_cents,
    currency: order.currency,
    payUrl,
    paymentUrl: payUrl,
    checkoutUrl: payUrl,
    plan,
  };
}

async function appPaymentPage(request: Request, env: Env, orderNo: string): Promise<Response> {
  const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency,metadata_json FROM app_orders WHERE order_no=?").bind(orderNo).first<AppOrder>();
  if (!order) return new Response("Order not found", { status: 404 });
  if (order.status === "paid") return new Response("<!doctype html><meta charset=\"utf-8\"><p>Payment already completed. You can return to the app.</p>", { headers: { "content-type": "text/html; charset=utf-8" } });
  if (!appPaymentConfigured(env)) return new Response("<!doctype html><meta charset=\"utf-8\"><p>Payment is not configured. Please set PAYMENT_API_BASE, PAYMENT_PID and PAYMENT_KEY.</p>", { status: 503, headers: { "content-type": "text/html; charset=utf-8" } });
  const plan = appPlans.find(item => item.id === order.plan_id) || appPlans[0];
  const fields = appPaymentFields(request, env, order, plan);
  const inputs = Object.entries(fields).map(([key, value]) => `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(value)}">`).join("");
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><title>Pay</title></head><body><form id="pay" method="post" action="${escapeHtml(appPaymentBase(env))}/submit.php">${inputs}<button type="submit">Continue to pay</button></form><script>document.getElementById('pay').submit();</script></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

async function appPaymentReturn(request: Request, env: Env): Promise<Response> {
  const orderNo = new URL(request.url).searchParams.get("order") || "";
  const order = orderNo
    ? await env.DB.prepare("SELECT status FROM app_orders WHERE order_no=?").bind(orderNo).first<{ status: string }>()
    : null;
  const paid = order?.status === "paid";
  return new Response(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Payment</title><style>body{font-family:system-ui,sans-serif;margin:0;display:grid;min-height:100vh;place-items:center;background:#f7faf7;color:#102016}.card{width:min(420px,calc(100vw - 32px));border:1px solid #dfe8de;border-radius:18px;background:white;padding:28px;box-shadow:0 18px 50px #10201614}h1{font-size:22px;margin:0 0 10px}p{color:#5d6b61;line-height:1.7}</style></head><body><main class="card"><h1>${paid ? "支付已确认" : "支付处理中"}</h1><p>${paid ? "会员已开通，请返回外贸加速器并刷新订阅。" : "如果已经完成支付，请稍等片刻后返回 App 点击“我已支付，刷新订阅”。"}</p></main></body></html>`, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c] || c));
}

async function appPaymentCallback(request: Request, env: Env): Promise<Response> {
  const values: Record<string, string> = request.method === "POST"
    ? Array.from((await request.formData()).entries()).reduce<Record<string, string>>((acc, [key, value]) => { acc[key] = String(value); return acc; }, {})
    : Object.fromEntries(new URL(request.url).searchParams.entries());
  if (!appPaymentConfigured(env)) return new Response("fail", { status: 503 });
  if (String(values.pid || "") !== String(env.PAYMENT_PID || "") || !values.sign || !(await secureEqual(values.sign, appPaymentSign(env, values)))) return new Response("fail", { status: 400 });
  const orderNo = String(values.out_trade_no || "");
  const order = await env.DB.prepare("SELECT id,order_no,user_id,plan_id,status,amount_cents,currency FROM app_orders WHERE order_no=?").bind(orderNo).first<AppOrder>();
  if (!order) return new Response("fail", { status: 404 });
  const paid = String(values.trade_status || "").toUpperCase() === "TRADE_SUCCESS" || String(values.status || "").toLowerCase() === "paid";
  if (!paid || Number(values.money) !== Number((order.amount_cents / 100).toFixed(2))) return new Response("fail", { status: 400 });
  if (order.status !== "paid") {
    const plan = appPlans.find(item => item.id === order.plan_id) || appPlans[0];
    const current = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(order.user_id).first<DbUser>();
    if (!current) return new Response("fail", { status: 404 });
    const startsAt = Math.max(Date.now(), Date.parse(current.expires_at || "") || 0);
    const expiresAt = new Date(startsAt + plan.days * 86400000).toISOString();
    await env.DB.prepare("UPDATE users SET expires_at=?,status='active',node_limit=? WHERE id=?").bind(expiresAt, plan.nodeLimit, current.id).run();
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(current.id).first<DbUser>();
    if (user) await provisionUser(env, user);
    await env.DB.prepare("UPDATE app_orders SET status='paid',provider_order_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(String(values.trade_no || ""), order.id).run();
  }
  return new Response("success", { headers: { "content-type": "text/plain; charset=utf-8" } });
}

async function api(request: Request, env: Env, url: URL): Promise<Response> {
  if (!(await authorized(request, env))) return json({ error: "未授权" }, 401);
  if (request.method === "GET" && url.pathname === "/api/dashboard") {
    const [upstreams, users] = await Promise.all([
      env.DB.prepare("SELECT id,name,enabled,last_synced_at,last_error,(SELECT COUNT(*) FROM nodes WHERE upstream_id=upstreams.id AND active=1) node_count FROM upstreams ORDER BY id DESC").all(),
      env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,token_hint,(SELECT COUNT(*) FROM user_dns_records WHERE user_id=users.id AND status='active') dns_count FROM users ORDER BY id DESC").all(),
    ]);
    return json({ upstreams: upstreams.results, users: users.results, dnsSuffix: env.DNS_SUFFIX });
  }
  const accessMatch = url.pathname.match(/^\/api\/users\/(\d+)\/accesses$/);
  if (request.method === "GET" && accessMatch) {
    const userId = Number(accessMatch[1]);
    const exists = await env.DB.prepare("SELECT id FROM users WHERE id=?").bind(userId).first();
    if (!exists) return json({ error: "用户不存在" }, 404);
    return json(await accessSummary(env, userId));
  }
  if (request.method === "POST" && url.pathname === "/api/upstreams") {
    const input = await body<{ name?: string; subscriptionUrl?: string }>(request);
    if (!input.name || !input.subscriptionUrl || !/^https:\/\//.test(input.subscriptionUrl)) return json({ error: "名称和 HTTPS 订阅地址必填" }, 400);
    const result = await env.DB.prepare("INSERT INTO upstreams(name,subscription_url) VALUES(?,?)").bind(input.name.trim(), input.subscriptionUrl.trim()).run();
    return json({ id: result.meta.last_row_id }, 201);
  }
  const syncMatch = url.pathname.match(/^\/api\/upstreams\/(\d+)\/sync$/);
  if (request.method === "POST" && syncMatch) {
    const upstreamId = Number(syncMatch[1]);
    const result = await syncUpstream(env, upstreamId);
    await reconcileUpstream(env, upstreamId);
    return json(result);
  }
  if (request.method === "POST" && url.pathname === "/api/users") {
    const input = await body<{ name?: string; upstreamId?: number; expiresAt?: string; nodeLimit?: number; selectedNodeIds?: number[]; pool?: boolean }>(request);
    if (!input.name || !input.upstreamId || !input.expiresAt || Number.isNaN(Date.parse(input.expiresAt))) return json({ error: "用户、上游和到期时间必填" }, 400);
    const token = randomToken();
    const nodeLimit = Math.max(1, Math.min(20, Number(input.nodeLimit || 5)));
    const result = await env.DB.prepare("INSERT INTO users(name,token_hash,token_hint,upstream_id,expires_at,node_limit) VALUES(?,?,?,?,?,?)")
      .bind(input.name.trim(), await hash(token), token.slice(0, 6), input.upstreamId, new Date(input.expiresAt).toISOString(), nodeLimit).run();
    const userId = Number(result.meta.last_row_id);
    const selectedNodeIds = Array.from(new Set((input.selectedNodeIds || []).map(Number).filter(Number.isInteger))).slice(0, nodeLimit);
    for (const nodeId of selectedNodeIds) {
      // A selected list always represents an intentional node choice.  Treat
      // it as a pool selection by default so older portal deployments can use
      // the merged pool without breaking their existing request shape.
      const usePool = input.pool || selectedNodeIds.length > 0;
      const sql = usePool
        ? "INSERT OR IGNORE INTO user_selected_nodes(user_id,node_id) SELECT ?,id FROM nodes WHERE id=? AND active=1"
        : "INSERT OR IGNORE INTO user_selected_nodes(user_id,node_id) SELECT ?,id FROM nodes WHERE id=? AND upstream_id=? AND active=1";
      const statement = usePool ? env.DB.prepare(sql).bind(userId, nodeId) : env.DB.prepare(sql).bind(userId, nodeId, input.upstreamId);
      await statement.run();
    }
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(userId).first<DbUser>();
    const provision = user ? await provisionUser(env, user) : { created: 0, failed: 0 };
    return json({ id: userId, token, subscriptionUrl: `${new URL(request.url).origin}/s/${token}`, ...provision }, 201);
  }
  if (request.method === "GET" && url.pathname === "/api/nodes") {
    const upstreamParam = url.searchParams.get("upstreamId");
    // `scope=upstream` is retained for the Worker administrator.  The portal
    // historically passed upstreamId=1, so without this explicit scope it now
    // receives the combined pool and gains the second subscription safely.
    if (upstreamParam && url.searchParams.get("scope") === "upstream") {
      const upstreamId = Math.max(1, Number(upstreamParam));
      const nodes = await env.DB.prepare("SELECT id,name,protocol FROM nodes WHERE upstream_id=? AND active=1 ORDER BY id").bind(upstreamId).all();
      return json({ nodes: nodes.results, pooled: false });
    }
    const rows = await env.DB.prepare(`SELECT n.id,n.fingerprint,n.name,n.protocol,n.original_server,n.original_uri,n.upstream_id,u.name source_name
      FROM nodes n JOIN upstreams u ON u.id=n.upstream_id
      WHERE n.active=1 AND u.enabled=1 ORDER BY u.id,n.id`).all<PoolNode>();
    const seen = new Set<string>();
    const nodes = rows.results.filter(node => {
      const key = connectionIdentity(node.original_uri, node.protocol);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(node => ({ id: node.id, name: node.name, protocol: node.protocol, sourceName: node.source_name }));
    return json({ nodes, pooled: true });
  }
  const disableMatch = url.pathname.match(/^\/api\/users\/(\d+)\/disable$/);
  if (request.method === "POST" && disableMatch) {
    const id = Number(disableMatch[1]);
    const result = await deprovisionUser(env, id);
    await env.DB.prepare("UPDATE users SET status='disabled' WHERE id=?").bind(id).run();
    return json(result);
  }
  const forceRefreshMatch = url.pathname.match(/^\/api\/users\/(\d+)\/force-subscription-refresh$/);
  if (request.method === "POST" && forceRefreshMatch) {
    const id = Number(forceRefreshMatch[1]);
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(id).first<DbUser>();
    if (!user) return json({ error: "用户不存在" }, 404);
    if (user.status !== "active" || Date.parse(user.expires_at) <= Date.now()) return json({ error: "仅可强制更新有效订阅" }, 409);
    const removed = await deprovisionUser(env, id);
    if (removed.failed) return json({ error: `旧 DNS 删除失败：${removed.failed} 条，请重试`, ...removed }, 502);
    await env.DB.prepare("UPDATE users SET dns_revision=dns_revision+1 WHERE id=?").bind(id).run();
    const refreshed = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(id).first<DbUser>();
    const provision = refreshed ? await provisionUser(env, refreshed) : { created: 0, failed: 1 };
    if (provision.failed) return json({ error: `新 DNS 创建失败：${provision.failed} 条`, ...removed, ...provision }, 502);
    return json({ ok: true, revision: refreshed?.dns_revision, ...removed, ...provision });
  }
  const renewMatch = url.pathname.match(/^\/api\/users\/(\d+)\/renew$/);
  if (request.method === "POST" && renewMatch) {
    const id = Number(renewMatch[1]);
    const input = await body<{ expiresAt?: string }>(request);
    if (!input.expiresAt || Number.isNaN(Date.parse(input.expiresAt))) return json({ error: "到期时间无效" }, 400);
    await env.DB.prepare("UPDATE users SET expires_at=?,status='active' WHERE id=?").bind(new Date(input.expiresAt).toISOString(), id).run();
    const user = await env.DB.prepare("SELECT id,name,upstream_id,expires_at,status,node_limit,dns_revision FROM users WHERE id=?").bind(id).first<DbUser>();
    return json(user ? await provisionUser(env, user) : { error: "用户不存在" }, user ? 200 : 404);
  }
  return json({ error: "接口不存在" }, 404);
}

async function subscription(request: Request, env: Env, token: string): Promise<Response> {
  const user = await env.DB.prepare("SELECT id,status,expires_at FROM users WHERE token_hash=?").bind(await hash(token)).first<SubscriptionUser>();
  if (!user) return new Response("订阅不存在", { status: 404 });
  if (user.status !== "active" || Date.parse(user.expires_at) <= Date.now()) return new Response("订阅已到期或停用", { status: 410 });
  await recordSubscriptionAccess(request, env, user.id);
  const rows = await env.DB.prepare(`SELECT n.name,n.protocol,n.original_uri,d.hostname FROM user_dns_records d JOIN nodes n ON n.id=d.node_id
    WHERE d.user_id=? AND d.status='active' AND n.active=1 ORDER BY n.name`).bind(user.id).all<{ name: string; protocol: string; original_uri: string; hostname: string }>();
  const encoded = encodeSubscription(rows.results.map(row => rewriteNode(row.original_uri, row.protocol, row.hostname, row.name)));
  return new Response(encoded, { headers: { "content-type": "text/plain; charset=utf-8", "subscription-userinfo": `expire=${Math.floor(Date.parse(user.expires_at) / 1000)}`, "cache-control": "no-store" } });
}

const adminHtml = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>限时订阅管理</title><style>
:root{font-family:Inter,system-ui,sans-serif;color:#152238;background:#f5f7fb}body{margin:0}.wrap{max-width:1050px;margin:40px auto;padding:0 18px}h1{margin:0 0 8px}.muted{color:#667085}.card{background:white;border:1px solid #e5e9f0;border-radius:14px;padding:20px;margin:18px 0;box-shadow:0 6px 22px #1831530a}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px}input,select,button{box-sizing:border-box;width:100%;padding:11px 12px;border:1px solid #ccd3df;border-radius:9px;font:inherit}button{background:#2265e5;color:white;border:0;cursor:pointer}button.gray{background:#526071}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:11px 8px;border-bottom:1px solid #edf0f5;font-size:14px}.actions{display:flex;gap:6px}.actions button{width:auto;padding:7px 10px}.pill{padding:3px 8px;border-radius:999px;background:#eaf7ef;color:#18733a}.error{color:#b42318;white-space:pre-wrap}.secret{max-width:500px}.hidden{display:none}@media(max-width:700px){table{display:block;overflow:auto}}
</style></head><body><main class="wrap"><h1>限时订阅管理</h1><p class="muted">通过专属 DNS 控制分享订阅的有效期</p>
<section class="card" id="login"><h2>管理员登录</h2><div class="grid"><input id="secret" type="password" placeholder="管理员密钥"><button onclick="login()">进入后台</button></div></section>
<div id="app" class="hidden"><section class="card"><h2>添加上游</h2><div class="grid"><input id="upName" placeholder="机场名称"><input id="upUrl" placeholder="HTTPS 订阅地址"><button onclick="addUpstream()">保存上游</button></div></section>
<section class="card"><h2>创建限时分享</h2><div class="grid"><input id="userName" placeholder="同事名称"><select id="upstream"></select><input id="expires" type="datetime-local"><button onclick="addUser()">创建并生成 DNS</button></div><p id="created"></p></section>
<section class="card"><h2>上游</h2><table><thead><tr><th>名称</th><th>节点</th><th>最近同步</th><th>状态</th><th></th></tr></thead><tbody id="upRows"></tbody></table></section>
<section class="card"><h2>分享用户</h2><table><thead><tr><th>用户</th><th>状态</th><th>到期</th><th>DNS</th><th></th></tr></thead><tbody id="userRows"></tbody></table></section><p id="error" class="error"></p></div></main><script>
let key=localStorage.getItem('adminKey')||'';const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function call(path,opt={}){const r=await fetch(path,{...opt,headers:{'content-type':'application/json','authorization':'Bearer '+key,...opt.headers}});const t=await r.text();let d;try{d=JSON.parse(t)}catch{d={error:t}}if(!r.ok)throw new Error(d.error||t);return d}
async function login(){key=document.querySelector('#secret').value;localStorage.setItem('adminKey',key);await load()}
async function load(){try{const d=await call('/api/dashboard');document.querySelector('#login').classList.add('hidden');document.querySelector('#app').classList.remove('hidden');document.querySelector('#error').textContent='';document.querySelector('#upstream').innerHTML=d.upstreams.map(x=>'<option value="'+x.id+'">'+esc(x.name)+'</option>').join('');document.querySelector('#upRows').innerHTML=d.upstreams.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+x.node_count+'</td><td>'+esc(x.last_synced_at||'未同步')+'</td><td>'+(x.last_error?'<span class="error">'+esc(x.last_error)+'</span>':'<span class="pill">正常</span>')+'</td><td><button onclick="syncUp('+x.id+')">同步</button></td></tr>').join('');document.querySelector('#userRows').innerHTML=d.users.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.status)+'</td><td>'+new Date(x.expires_at).toLocaleString()+'</td><td>'+x.dns_count+'</td><td><div class="actions"><button class="gray" onclick="renew('+x.id+')">续期</button><button class="gray" onclick="disable('+x.id+')">停用</button></div></td></tr>').join('')}catch(e){document.querySelector('#error').textContent=e.message;throw e}}
async function addUpstream(){await run(async()=>{await call('/api/upstreams',{method:'POST',body:JSON.stringify({name:upName.value,subscriptionUrl:upUrl.value})});await load()})}
async function syncUp(id){await run(async()=>{const d=await call('/api/upstreams/'+id+'/sync',{method:'POST'});alert('同步完成：'+d.found+' 个节点');await load()})}
async function addUser(){await run(async()=>{const d=await call('/api/users',{method:'POST',body:JSON.stringify({name:userName.value,upstreamId:Number(upstream.value),expiresAt:new Date(expires.value).toISOString()})});document.querySelector('#created').innerHTML='订阅：<a href="'+d.subscriptionUrl+'" target="_blank">'+esc(d.subscriptionUrl)+'</a>（请立即保存，页面刷新后不再显示）';await load()})}
async function disable(id){if(confirm('确定停用并删除该用户 DNS？'))await run(async()=>{await call('/api/users/'+id+'/disable',{method:'POST'});await load()})}
async function renew(id){const v=prompt('新的到期时间（例如 2026-09-30 18:00）');if(v)await run(async()=>{await call('/api/users/'+id+'/renew',{method:'POST',body:JSON.stringify({expiresAt:new Date(v).toISOString()})});await load()})}
async function run(fn){try{await fn()}catch(e){document.querySelector('#error').textContent=e.message}}
if(key)load();
</script></body></html>`;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      const url = new URL(request.url);
      if (url.pathname.startsWith("/api/app/")) {
        const response = await appApi(request, env, url);
        if (response) return response;
      }
      if (url.pathname === "/api/app/payment/notify") return appPaymentCallback(request, env);
      if (url.pathname === "/api/app/payment/return") return appPaymentReturn(request, env);
      const appPayMatch = url.pathname.match(/^\/app-pay\/([^/]+)$/);
      if (request.method === "GET" && appPayMatch) return appPaymentPage(request, env, decodeURIComponent(appPayMatch[1]));
      const appSubscriptionMatch = url.pathname.match(/^\/api\/subscription\/([A-Za-z0-9_-]{20,})$/);
      if (request.method === "GET" && appSubscriptionMatch) return subscription(request, env, appSubscriptionMatch[1]);
      if (url.pathname.startsWith("/api/")) return api(request, env, url);
      const match = url.pathname.match(/^\/s\/([A-Za-z0-9_-]{20,})$/);
      if (request.method === "GET" && match) return subscription(request, env, match[1]);
      if (request.method === "GET" && url.pathname === "/") return new Response(adminHtml, { headers: { "content-type": "text/html; charset=utf-8", "content-security-policy": "default-src 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'", "x-content-type-options": "nosniff", "referrer-policy": "no-referrer" } });
      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error(JSON.stringify({ event: "request_error", error: error instanceof Error ? error.message : String(error) }));
      return json({ error: error instanceof Error ? error.message : "服务器错误" }, 500);
    }
  },
  async scheduled(controller: ScheduledController, env: Env): Promise<void> {
    if (controller.cron === "7 * * * *") {
      const upstreams = await syncAllUpstreams(env);
      console.log(JSON.stringify({ event: "sync_complete", upstreams }));
      return;
    }
    const now = new Date();
    if (now.getUTCHours() === 19 && now.getUTCMinutes() < 5) {
      const result = await env.DB.prepare("DELETE FROM subscription_access_daily WHERE access_date<date('now','-30 day')").run();
      console.log(JSON.stringify({ event: "access_log_retention_complete", deleted: result.meta.changes }));
    }
    const expired = await expireUsers(env);
    console.log(JSON.stringify({ event: "expiry_complete", expired }));
  },
} satisfies ExportedHandler<Env>;
