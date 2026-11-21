# 外贸加速器 APP 后端与管理系统 (`waimao-backend`)

> **服务名称**：Cloudflare Worker `dns-sub-share-app` / `dns-sub-share`  
> **生产入口**：`https://app.5858188.xyz`  
> **GitHub 仓库**：`https://github.com/Jackyderrick/wlbpg-subscription-portal.git`（分支：`main` / `dev`）  
> **服务对象**：外贸加速器 Android 客户端（`waimao-accelerator-android`）、Windows 桌面端（`simao-pc`）、Web 管理后台（Admin Workbench V2）

---

## 一、系统架构与云端资源

- **计算运行时**：Cloudflare Workers（TypeScript，`nodejs_compat` 模式）
- **数据库 (Cloudflare D1)**：
  - 生产库名称：`dns-sub-share-app-db`（绑定名 `DB`，UUID: `bb1aea03-434b-4994-8ee4-49c6fc28127e`）
- **对象存储 (Cloudflare R2)**：
  - 存储桶：`waimao-app-releases`（绑定名 `APP_RELEASES`，公网 CDN：`https://pub-a875cd2b61b44fd0b04710f9bb172bdb.r2.dev`）
- **专属 DNS 置换池 (`DNS_POOLS`)**：
  - 4 个域名池自动轮询分配：`ddda.dpdns.org`、`subwlbpg.ggff.net`、`subwlbpg.kdns.fr`、`wlbpg.kdns.fr`（单池上限 190 条，DNS-only 不开启橙云代理）
- **支付网关**：
  - 彩虹易支付协议（现网对接 MotionPay：`https://motionpay.net`）

---

## 二、核心业务特性

1. **全协议订阅解析与专属 DNS CNAME `sni` 自动保护 (`src/parser.ts`)**：
   - 支持 `vless`、`vmess`、`trojan`、`ss`（含 Shadowsocks 2022）、`hysteria2`/`hy2`、`anytls`、`tuic` 协议。
   - 支持直接粘贴单条/多条节点 URI、Base64 文本或远程订阅 URL，自动过滤含“剩余流量/套餐到期/官网导航”等字样的伪节点。
   - **TLS SNI 保留**：`rewriteNode()` 在将原始节点域名重写为用户专属 DNS 子域名前，若原主机为域名且未携带 `sni`，会自动注入 `?sni=<原始域名>`（VMess 注入 `json.sni`），确保客户端 TLS 握手与测速正常。

2. **四档套餐体系与节点池管理 (`migrations/0009_plan_nodes.sql`)**：
   - 内置 4 档标准套餐：**体验 (`trial_1d`) / 基础 (`basic_monthly`) / 高级 (`advanced_monthly`) / 家宽 (`residential_monthly`)**。
   - 支持按套餐统一勾选分配节点池（`plan_selected_nodes`），也支持为单个客户特殊指派专属节点（`user_selected_nodes`）。

3. **单账号 2 台设备上限与 FIFO 自动顶号 (`migrations/0008_user_device_limit.sql`)**：
   - 每个用户默认限制最多同时在线/绑定 2 台设备（`device_limit = 2`）。
   - 新设备登录超出上限时，按最早活跃时间（FIFO）自动淘汰旧设备会话，管理后台亦支持手动踢出指定设备。

4. **客户端引导、邮箱绑定与找回 (`src/index.ts`)**：
   - `POST /api/app/bootstrap`：根据设备 UUID 自动注册访客试用账号（移动端前缀 `App Guest`，桌面端前缀 `Web Guest`），返回 Bearer Token、套餐详情与订阅地址。
   - 支持邮箱验证码绑定与跨设备账号找回（`app_user_profiles`、`app_email_codes`）。

5. **支付幂等与会员自动顺延 (`migrations/0011_payment_idempotency.sql`)**：
   - 通过 `app_order_grants` 账本表保证支付异步回调 100% 幂等，支付成功后自动顺延会员有效期并异步触发专属 DNS 重建。

6. **双端软件更新分发通道**：
   - Android 更新检测：`GET /api/app/update`（返回最新 `versionCode`、下载直链、更新日志与 SHA256）
   - Android 快捷下载重定向：`GET /app`（302 重定向至最新 APK）
   - Windows 桌面端更新：`GET /appcast.xml`（Sparkle 2.0 RSS XML，由环境变量 `APP_UPDATE_WINDOWS_VERSION` 动态驱动）

---

## 三、本地开发、测试与部署

### 1. 安装依赖与运行测试
```bash
npm install
npm run check   # TypeScript 静态类型检查 (tsc --noEmit)
npm test        # 运行 Vitest 自动化测试套件
```

### 2. 本地启动调试
```bash
npm run dev
```

### 3. 数据库迁移 (D1 Migrations)
```bash
# 本地测试库迁移
npx wrangler d1 migrations apply DB --local

# 生产远程数据库迁移（使用 wrangler.app.jsonc）
npx wrangler d1 migrations apply DB --remote -c wrangler.app.jsonc
```

### 4. 部署到生产环境（双 Worker 架构）

本系统采用在线业务与后台定时调度完全隔离的**双 Worker 架构**：

- **`dns-sub-share-app`（在线业务 Worker）**：承载客户端启动引导 (`/api/app/bootstrap`)、订阅分发 (`/api/subscription/:token`)、支付回调 (`/api/payment/notify`) 与 Web 管理后台。无 Cron 触发器。
- **`dns-sub-share-cron`（定时调度 Worker）**：承载定时上游同步 (`7 * * * *`)、自愈巡检与过期表清理 (`*/15 * * * *`)、用户到期处理与匿名试用垃圾数据清理 (`*/5 * * * *`)，以及手动运维接口 (`/health`、`/run`)。

```bash
# 1. 静态检查
npm run check:cron   # 定时 Worker 与 Parser 严格 TypeScript 检查 (0 错误)
npm test             # 运行全量 Vitest 自动化测试套件

# 2. 部署主站业务 Worker (dns-sub-share-app，对应 app.5858188.xyz)
npm run deploy:app

# 3. 部署独立定时任务 Worker (dns-sub-share-cron)
npm run deploy:cron
```

#### 定时任务 Worker (`dns-sub-share-cron`) 密钥配置
需通过 `npx wrangler secret put <KEY> -c wrangler.cron.jsonc` 注入：
- `CF_API_TOKEN`：具备 4 个 DNS 域名池 Zone 编辑权限的 Cloudflare API Token（与主站一致）。
- `CRON_TRIGGER_SECRET`：手动运维与应急触发接口 (`POST /run?job=...`) 的 Bearer Token。
- `ALERT_WEBHOOK_URL`（可选）：域名池高水位或异常熔断时的通知 Webhook。

---

## 四、环境变量与 Secrets 说明

### 1. 公开环境变量（`wrangler.app.jsonc` / `wrangler.jsonc` 中的 `vars`）
- `DNS_SUFFIX` / `CF_ZONE_ID` / `DNS_POOLS`：专属 DNS 域名池配置
- `APP_UPDATE_VERSION_CODE`：Android 最新版本号（当前为 `"10006"`）
- `APP_UPDATE_VERSION_NAME`：Android 最新版本名称（`"1.15.0-alpha.13"`）
- `APP_UPDATE_APK_URL` / `APP_UPDATE_RELEASE_URL`：R2 APK 下载直链
- `APP_UPDATE_MESSAGE`：Android 更新弹窗文案
- `APP_UPDATE_SHA256`：Android APK SHA-256 校验值
- `APP_UPDATE_WINDOWS_VERSION` / `APP_UPDATE_WINDOWS_NOTES`：Windows 桌面端最新版本号（当前 `"4.3.0"`）与更新说明

### 2. 生产 Secrets（通过 `npx wrangler secret put <KEY> -c wrangler.app.jsonc` 配置）
| Secret 名称 | 用途说明 |
| :--- | :--- |
| `ADMIN_SECRET` | 登录 `https://app.5858188.xyz` 管理后台的管理员口令 |
| `CF_API_TOKEN` | 具备 4 个 DNS Zone 编辑权限的 Cloudflare API 令牌 |
| `PAYMENT_API_BASE` | 易支付网关地址（现网 `https://motionpay.net`） |
| `PAYMENT_PID` | 易支付商户 ID |
| `PAYMENT_KEY` | 易支付 MD5 签名密钥 |

---

## 五、Roadmap（待排期功能）

以下功能已完成架构论证，列入后续迭代计划（本次仅归档方案，不涉及代码实现与建表）：

1. **节点连通性探针（方案 B）**：
   - 国内轻量 `sing-box` 探针定时实测节点真实连接与 TLS 握手延迟。
   - 探针通过 HMAC/Token 安全上报至 Worker 并写入 `node_health` 状态表。
   - 驱动定时 Worker 自动摘除高丢包/失联故障节点，并在恢复后重新投入轮询。

2. **用户级流量统计与配额控制**：
   - **路线一（客户端软控）**：移动端/桌面端定时上报本地累计流量，达到套餐阈值后软性限制连接，实施路径轻量、落地最快。
   - **路线二（自建中转/家宽落地硬控）**：经由受控落地或前置转发节点抓取真实传输字节数，服务端联动精确限流与熔断。
