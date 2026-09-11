# 限时订阅管理

通过 Cloudflare Worker、D1 和 DNS API，把机场订阅中的节点地址替换成每位分享用户的专属 DNS；到期后自动删除 DNS 并停用订阅。

## 第一版支持

- Base64 或逐行 URI 订阅
- VLESS、VMess、Trojan、常见 Shadowsocks URI
- 上游手动同步，并立即为现有有效用户补建或清理 DNS
- 上游每小时自动同步，并为有效用户增删相应 DNS
- 创建限时分享
- 专属 A、AAAA 或 CNAME（DNS-only）
- 每 5 分钟自动处理到期用户
- 手动停用和续期

## 部署前配置

1. 创建 D1 数据库并将 ID 写入 `wrangler.jsonc`。
2. 将 `DNS_SUFFIX` 改为专属子域名，例如 `node.example.com`。
3. 将对应域名的 Zone ID 写入 `CF_ZONE_ID`。
4. 设置 `CF_API_TOKEN` Secret，权限仅需对应 Zone 的 DNS Write。
5. 设置随机的 `ADMIN_SECRET` Secret。
6. 应用远程 D1 migrations 后部署。

Cloudflare DNS 必须使用 `proxied: false`。本工具属于轻量到期控制，无法阻止用户主动还原机场原始域名或 IP。
