# 安卓客户端（及桌面端）多协议订阅解析升级对接文档

## 一、问题背景与现象

1. **现象描述**：
   - 管理后台（`https://app.5858188.xyz`）已支持同步并下发包含 `vless`、`vmess`、`trojan`、`ss`（含 Shadowsocks 2022）、`hysteria2`（`hy2`）、`anytls`、`tuic` 在内的全协议节点。
   - 以测试账号 `#9 Jacky-Tester` 为例，后台为其勾选并成功下发了 **12 个节点**（其中 5 个 `vless`、4 个 `hysteria2`、3 个 `anytls`）。
   - 但安卓端（当前基于 `SFA 1.15.0-alpha.13`）在拉取 `/api/subscription/:token` 订阅后，在 `auto-best`（URLTest）和 `proxy-select`（Selector）策略组中**仅显示了 5 个 `vless` 节点**，其余 4 个 `hysteria2` 和 3 个 `anytls` 节点全部被丢弃，未显示在节点列表中。

2. **根因定位**：
   - 服务端 `/api/subscription/:token` 返回的是标准 Base64 编码的多行节点 URI 文本（解码后每行一条 `protocol://...` 链接）。
   - 安卓端内置的底层核心 `sing-box 1.15.0-alpha.13` **原生完全支持** `hysteria2`、`anytls`、`tuic` 及 `ss (2022-blake3-*)` 协议；
   - 但**安卓客户端上层将 Base64 订阅 URI 转换为 `sing-box` JSON Outbound 的解析器代码**，目前仅处理了 `vless://`、`vmess://`、`trojan://` 和基础 `ss://`，遇到 `hysteria2://`、`hy2://`、`anytls://`、`tuic://` 前缀时直接跳过忽略，导致节点缺失。

---

## 二、核心注意事项：专属 DNS 重写与 TLS `sni` 校验（必读）

服务端为了实现按用户隔离与分配专属 DNS，会将原始节点的域名（例如 `ali.9527jc.sbs`）重写为用户的专属 CNAME 域名（例如 `u9-r0-a9dbc97750-486.wlbpg.kdns.fr`），同时**服务端已在 URI 查询参数中自动保留并注入了 `&sni=<原始节点域名>`**（例如 `&sni=ali.9527jc.sbs`）。

> **重要要求**：  
> 安卓端在解析所有基于 TLS 的协议（`vless`、`trojan`、`hysteria2` / `hy2`、`anytls`、`tuic`）生成 `sing-box` 的 `tls` 配置块时：
> - **`server` 字段**：填写 URI 中的 `url.hostname`（即重写后的专属 DNS 域名 `u9-r0-...`）；
> - **`tls.server_name` 字段**：**必须优先读取 URI query 参数中的 `sni`（或 `servername` / `peer`）**！只有当 query 参数中不存在 `sni` / `servername` / `peer` 时，才回退使用 `url.hostname`。否则拿着重写后的专属 DNS 域名去校验原服务器的 TLS 证书会导致握手失败、测速超时！

---

## 三、服务端下发的真实 URI 格式与 `sing-box` Outbound 转换规范

请在安卓端订阅解析器中补齐以下协议的 URI 解析与 `sing-box` Outbound 映射，并将解析出的 Outbound `tag` 一并加入 `auto-best`（`urltest`）和 `proxy-select`（`selector`）的 `outbounds` 列表中：

### 1. `hysteria2://`（及别名 `hy2://`）

- **服务端下发的 URI 示例**：
  ```text
  hysteria2://bf0495cd-4c47-4dab-b531-d6b3c6cf7d2b@u9-r0-a9dbc97750-486.wlbpg.kdns.fr:20944?insecure=0&obfs=salamander&obfs-password=6cKAEn89LVG3xHac&sni=ali.9527jc.sbs#%E8%8A%82%E7%82%B9%20%C2%B7%20%F0%9F%87%B5%F0%9F%87%AD%E8%8F%B2%E5%BE%8B%E5%AE%BE_02%20%7C%20%E9%98%BF%E9%87%8CBGPx1
  ```
- **URI 字段解析规则**：
  - `scheme`: `hysteria2` 或 `hy2`
  - `password`: `decodeURIComponent(url.username)`（若包含 `url.password` 则拼接为 `username:password`）
  - `server`: `url.hostname`
  - `server_port`: `Number(url.port || 443)`
  - `obfs`: 当 query 参数 `obfs=salamander` 且存在 `obfs-password` 时，构造 `obfs: { type: "salamander", password: query["obfs-password"] }`
  - `tls.server_name`: `query["sni"] || query["peer"] || url.hostname`
  - `tls.insecure`: `query["insecure"] === "1" || query["allowInsecure"] === "1" || query["insecure"] === "true"`
  - `tls.alpn`: 若 query 中有 `alpn` 则按逗号分割，否则可省略（或默认 `["h3"]`）
- **目标 `sing-box` Outbound JSON 结构**：
  ```json
  {
    "type": "hysteria2",
    "tag": "节点 · 🇵🇭菲律宾_02 | 阿里BGPx1",
    "server": "u9-r0-a9dbc97750-486.wlbpg.kdns.fr",
    "server_port": 20944,
    "password": "bf0495cd-4c47-4dab-b531-d6b3c6cf7d2b",
    "obfs": {
      "type": "salamander",
      "password": "6cKAEn89LVG3xHac"
    },
    "tls": {
      "enabled": true,
      "server_name": "ali.9527jc.sbs",
      "insecure": false
    }
  }
  ```

---

### 2. `anytls://`（sing-box 1.12+ 原生支持）

- **服务端下发的 URI 示例**：
  ```text
  anytls://bf0495cd-4c47-4dab-b531-d6b3c6cf7d2b@u9-r0-4118900ad4-470.wlbpg.kdns.fr:59513?insecure=0&sni=ali.9527jc.sbs#%E8%8A%82%E7%82%B9%20%C2%B7%20%F0%9F%87%A8%F0%9F%87%B3%E5%8F%B0%E6%B9%BE_01%20%7C%20%E9%98%BF%E9%87%8CBGPx1
  ```
- **URI 字段解析规则**：
  - `scheme`: `anytls`
  - `password`: `decodeURIComponent(url.username)`
  - `server`: `url.hostname`
  - `server_port`: `Number(url.port || 443)`
  - `tls.server_name`: `query["sni"] || query["servername"] || query["peer"] || url.hostname`
  - `tls.insecure`: `query["insecure"] === "1" || query["allowInsecure"] === "1" || query["insecure"] === "true"`
- **目标 `sing-box` Outbound JSON 结构**：
  ```json
  {
    "type": "anytls",
    "tag": "节点 · 🇨🇳台湾_01 | 阿里BGPx1",
    "server": "u9-r0-4118900ad4-470.wlbpg.kdns.fr",
    "server_port": 59513,
    "password": "bf0495cd-4c47-4dab-b531-d6b3c6cf7d2b",
    "tls": {
      "enabled": true,
      "server_name": "ali.9527jc.sbs",
      "insecure": false
    }
  }
  ```

---

### 3. `ss://`（兼容 Shadowsocks 2022 多密钥与 SIP002 格式）

- **服务端下发的 URI 示例（Shadowsocks 2022 格式）**：
  ```text
  ss://MjAyMi1ibGFrZTMtYWVzLTEyOC1nY206WkdZM016STFNV0ppWXpkalpXUXdOdz09OlltWXdORGsxWTJRdE5HTTBOeTAwWkE9PQ@u9-r0-7c2401f50c-382.ddda.dpdns.org:19793#%E8%8A%82%E7%82%B9%20%C2%B7%20%F0%9F%87%AD%F0%9F%87%B0%E9%A6%99%E6%B8%AF_01%20%7C%20ix%E4%B8%93%E7%BA%BF%E5%85%A5%E5%8F%A3x1
  ```
- **URI 字段解析注意点**：
  - `@` 前面的 `userinfo` 部分为 Base64（URL-Safe Base64，可能省略 `=` padding）。
  - 对 `userinfo` 进行 Base64 解码后得到的字符串格式为：
    `2022-blake3-aes-128-gcm:ZGY3MzI1MWJiYzdjZWQwNw==:YmYwNDk1Y2QtNGM0Ny00ZGE=`
  - **关键点**：解码后切分 `method` 和 `password` 时，**只能按第一个冒号 `:` 切分**（`indexOf(':')`）！
    - 第一个冒号前为 `method`：`2022-blake3-aes-128-gcm`
    - 第一个冒号后的**全部剩余内容**为 `password`：`ZGY3MzI1MWJiYzdjZWQwNw==:YmYwNDk1Y2QtNGM0Ny00ZGE=`（SS-2022 EIH 扩展密钥以 `:` 连接两段 Base64 密钥，切勿用 `split(':')` 只取第一段，否则会导致密钥截断无法连接！）
- **目标 `sing-box` Outbound JSON 结构**：
  ```json
  {
    "type": "shadowsocks",
    "tag": "节点 · 🇭🇰香港_01 | ix专线入口x1",
    "server": "u9-r0-7c2401f50c-382.ddda.dpdns.org",
    "server_port": 19793,
    "method": "2022-blake3-aes-128-gcm",
    "password": "ZGY3MzI1MWJiYzdjZWQwNw==:YmYwNDk1Y2QtNGM0Ny00ZGE="
  }
  ```

---

### 4. `tuic://`（可选一并补齐）

- **目标 `sing-box` Outbound JSON 结构**：
  ```json
  {
    "type": "tuic",
    "tag": "节点名称",
    "server": "u9-r0-xxxx.ddda.dpdns.org",
    "server_port": 443,
    "uuid": "<url.username>",
    "password": "<url.password>",
    "congestion_control": "bbr",
    "tls": {
      "enabled": true,
      "server_name": "<query.sni || url.hostname>",
      "alpn": ["h3"]
    }
  }
  ```

---

## 四、验收标准

1. 使用测试账号 `#9 Jacky-Tester` 在安卓端登录或刷新订阅；
2. 节点列表（`auto-best` 与 `proxy-select`）应完整显示后台勾选的全部 **12 个节点**（包含 `VLESS`、`Hysteria2`、`AnyTLS` 协议标签）；
3. 若后台勾选 `SS`（`2022-blake3-aes-128-gcm`）节点，同样能在节点列表正常显示；
4. 点击右上角测速按钮，`VLESS`、`Hysteria2`、`AnyTLS`、`SS` 节点均能正常返回延迟（ms）并正常代理上网。
