# 节点订阅中心（宝塔第一版）

无第三方运行时依赖的 Node.js 门户。包含注册、登录、用户中心、管理员设置订阅、套餐展示和余额支付。

## 环境变量

- `PORT`：默认 `3180`
- `ADMIN_USER`：管理员登录名
- `ADMIN_PASSWORD`：管理员密码，必须设置
- `WORKER_URL`：订阅 Worker 地址
- `WORKER_ADMIN_SECRET`：订阅 Worker 的管理密钥，必须设置
- `WORKER_UPSTREAM_ID`：默认上游编号，默认 `1`
- `PAYMENT_API_BASE`：支付服务接口根地址
- `PAYMENT_PID`：支付商户号
- `PAYMENT_KEY`：支付签名密钥
- `PUBLIC_BASE_URL`：门户的公开 HTTPS 地址

将 `.env.example` 复制为仅在服务器保存的 `.env`，再填入真实值。不要提交 `.env` 或 `data/db.json`。

数据保存于 `data/db.json`，权限应限制为应用运行用户可读写。Nginx负责HTTPS和反向代理。
