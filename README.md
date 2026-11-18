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

### 4. 部署到生产环境
```bash
# 登录 Cloudflare（首次在新设备执行）
npx wrangler login

# 部署至生产 Worker (dns-sub-share-app，对应 app.5858188.xyz)
npx wrangler deploy -c wrangler.app.jsonc
```

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
