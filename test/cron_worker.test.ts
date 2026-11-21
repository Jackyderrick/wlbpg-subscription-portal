import { afterEach, describe, expect, it, vi } from "vitest";
import cronWorker, {
  localizedNodeName,
  normalizePlanId,
  Env,
} from "../src/cron-worker";

describe("独立定时任务 Worker (dns-sub-share-cron) 规范验证", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // 用例 1：运维接口安全鉴权测试
  it("用例 1: 运维接口安全鉴权测试 (/health 与 /run 权限控制)", async () => {
    const createMockStmt = () => ({
      bind: () => createMockStmt(),
      run: async () => ({ success: true, meta: { changes: 1 } }),
      all: async () => ({ results: [] }),
      first: async () => null,
    });
    const mockEnv: Env = {
      DB: {
        prepare: () => createMockStmt(),
      } as any,
      CF_API_TOKEN: "tok",
      DNS_SUFFIX: "ddda.dpdns.org",
      CF_ZONE_ID: "zone1",
    };

    // 1.1 GET /health
    const healthReq = new Request("https://cron.local/health");
    const healthRes = await cronWorker.fetch(healthReq, mockEnv, {} as any);
    expect(healthRes.status).toBe(200);
    const healthBody = (await healthRes.json()) as any;
    expect(healthBody.ok).toBe(true);
    expect(healthBody.worker).toBe("dns-sub-share-cron");
    expect(typeof healthBody.timestamp).toBe("string");

    // 1.2 未配置 CRON_TRIGGER_SECRET 时，POST /run 返回 404
    const noSecretReq = new Request("https://cron.local/run?job=heal", { method: "POST" });
    const noSecretRes = await cronWorker.fetch(noSecretReq, mockEnv, {} as any);
    expect(noSecretRes.status).toBe(404);

    // 1.3 配置 CRON_TRIGGER_SECRET="s3cr3t"
    const authedEnv: Env = {
      ...mockEnv,
      CRON_TRIGGER_SECRET: "s3cr3t",
    };

    // 无授权头 -> 401
    const unauthedReq = new Request("https://cron.local/run?job=heal", { method: "POST" });
    const unauthedRes = await cronWorker.fetch(unauthedReq, authedEnv, {} as any);
    expect(unauthedRes.status).toBe(401);

    // 错密码 -> 401
    const wrongAuthReq = new Request("https://cron.local/run?job=heal", {
      method: "POST",
      headers: { authorization: "Bearer wrong-pass" },
    });
    const wrongAuthRes = await cronWorker.fetch(wrongAuthReq, authedEnv, {} as any);
    expect(wrongAuthRes.status).toBe(401);

    // 正确密码，但非法 job -> 400
    const invalidJobReq = new Request("https://cron.local/run?job=dropdb", {
      method: "POST",
      headers: { authorization: "Bearer s3cr3t" },
    });
    const invalidJobRes = await cronWorker.fetch(invalidJobReq, authedEnv, {} as any);
    expect(invalidJobRes.status).toBe(400);

    // 正确密码 + 正确 job -> 200
    const okJobReq = new Request("https://cron.local/run?job=heal", {
      method: "POST",
      headers: { authorization: "Bearer s3cr3t" },
    });
    const okJobRes = await cronWorker.fetch(okJobReq, authedEnv, {} as any);
    expect(okJobRes.status).toBe(200);
    const okBody = (await okJobRes.json()) as any;
    expect(okBody.ok).toBe(true);
    expect(okBody.job).toBe("heal");
    expect(typeof okBody.durationMs).toBe("number");
  });

  // 用例 2：命名与套餐归一化一致性断言
  it("用例 2: 命名与套餐归一化一致性断言", () => {
    expect(localizedNodeName("🇺🇸 United States 01", 1)).toBe("节点 · 🇺🇸美国 01");
    expect(localizedNodeName("🇭🇰 Hong Kong A", 2)).toBe("节点 · 🇭🇰香港 A · 线路二");
    expect(localizedNodeName("🇯🇵 Japan Tokyo 01", 1)).toBe("节点 · 🇯🇵日本 Tokyo 01");
    expect(localizedNodeName("Custom Node", 1)).toBe("节点 · Custom Node");

    expect(normalizePlanId("standard_monthly")).toBe("advanced_monthly");
    expect(normalizePlanId("standard_quarterly")).toBe("advanced_monthly");
    expect(normalizePlanId("standard_yearly")).toBe("advanced_monthly");
    expect(normalizePlanId("")).toBe("trial_1d");
    expect(normalizePlanId(null)).toBe("trial_1d");
    expect(normalizePlanId(undefined)).toBe("trial_1d");
    expect(normalizePlanId("basic_monthly")).toBe("basic_monthly");
    expect(normalizePlanId("residential_monthly")).toBe("residential_monthly");
  });

  // 用例 3：*/15 * * * * 自愈与故障池熔断测试
  it("用例 3: */15 * * * * 自愈与故障池熔断测试 (池A只撞1次，3节点落池B，清理辅助表)", async () => {
    const poolAZone = "11111111222233334444555566667777";
    const poolBZone = "22222222333344445555666677778888";

    const executedSqls: string[] = [];
    let poolARequests = 0;
    let poolBRequests = 0;

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url: any, init: any) => {
      const urlStr = String(url);
      if (urlStr.includes(poolAZone)) {
        poolARequests++;
        return new Response(JSON.stringify({ success: false, errors: [{ code: 500, message: "Zone A down" }] }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
      if (urlStr.includes(poolBZone)) {
        poolBRequests++;
        return new Response(JSON.stringify({ success: true, result: { id: `rec-b-${poolBRequests}` } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };

    try {
      const mockEnv: Env = {
        CF_API_TOKEN: "tok",
        DNS_SUFFIX: "ddda.dpdns.org",
        CF_ZONE_ID: poolAZone,
        DNS_POOLS: JSON.stringify([
          { suffix: "pool-a.xyz", zoneId: poolAZone, maxRecords: 100 },
          { suffix: "pool-b.xyz", zoneId: poolBZone, maxRecords: 100 },
        ]),
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => createStmt(newArgs),
              run: async () => {
                executedSqls.push(sql);
                return { success: true, meta: { changes: 1 } };
              },
              first: async () => null,
              all: async () => {
                executedSqls.push(sql);
                if (sql.includes("FROM users u") && sql.includes("HAVING COUNT(d.id) < u.node_limit")) {
                  return {
                    results: [
                      {
                        id: 55,
                        name: "Candidate 55",
                        upstream_id: 1,
                        expires_at: "2028-01-01T00:00:00Z",
                        status: "active",
                        node_limit: 3,
                        plan_id: "trial_1d",
                        dns_revision: 0,
                      },
                    ],
                  };
                }
                if (sql.includes("FROM nodes") && sql.includes("WHERE upstream_id=?")) {
                  return {
                    results: [
                      { id: 1, fingerprint: "fp1", name: "Node 1", protocol: "vless", original_server: "1.1.1.1", original_uri: "vless://1" },
                      { id: 2, fingerprint: "fp2", name: "Node 2", protocol: "vless", original_server: "2.2.2.2", original_uri: "vless://2" },
                      { id: 3, fingerprint: "fp3", name: "Node 3", protocol: "vless", original_server: "3.3.3.3", original_uri: "vless://3" },
                    ],
                  };
                }
                if (sql.includes("SELECT COALESCE(zone_id, ?) zone_id, status, COUNT(*) total FROM user_dns_records")) {
                  return {
                    results: [
                      { zone_id: poolAZone, status: "active", total: 10 },
                      { zone_id: poolBZone, status: "active", total: 10 },
                    ],
                  };
                }
                return { results: [] };
              },
            });
            return createStmt([]);
          },
        } as any,
      };

      await cronWorker.scheduled({ cron: "*/15 * * * *", scheduledTime: Date.now() } as any, mockEnv, {} as any);

      // 验证池 A 在整个自愈创建过程中最多被撞 1 次（外层 failedZoneIds 熔断生效）
      expect(poolARequests).toBe(1);
      // 验证 3 个节点全部成功落在池 B
      expect(poolBRequests).toBe(3);

      // 验证辅助表清理 SQL 均被执行
      expect(executedSqls.some((s) => s.includes("DELETE FROM app_rate_limits"))).toBe(true);
      expect(executedSqls.some((s) => s.includes("DELETE FROM app_email_codes"))).toBe(true);
      expect(executedSqls.some((s) => s.includes("DELETE FROM app_sessions"))).toBe(true);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // 用例 4：域名池高水位告警测试
  it("用例 4: 域名池高水位告警测试 (>= 0.85 触发 alert_webhook，webhook 500 不抛错)", async () => {
    const poolZone = "11111111222233334444555566667777";
    let webhookCalls = 0;
    const warns: string[] = [];
    const origWarn = console.warn;
    console.warn = (...args: any[]) => warns.push(args.join(" "));

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url: any, init: any) => {
      const urlStr = String(url);
      if (urlStr === "https://alert.webhook.local/") {
        webhookCalls++;
        return new Response("Internal Server Error", { status: 500 });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };

    try {
      const mockEnv: Env = {
        CF_API_TOKEN: "tok",
        DNS_SUFFIX: "ddda.dpdns.org",
        CF_ZONE_ID: poolZone,
        DNS_POOLS: JSON.stringify([{ suffix: "pool.xyz", zoneId: poolZone, maxRecords: 100 }]),
        ALERT_WEBHOOK_URL: "https://alert.webhook.local/",
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => createStmt(newArgs),
              run: async () => ({ success: true }),
              first: async () => null,
              all: async () => {
                if (sql.includes("SELECT COALESCE(zone_id, ?) zone_id, status, COUNT(*) total FROM user_dns_records")) {
                  // 88 / 100 = 88% >= 85%
                  return { results: [{ zone_id: poolZone, status: "active", total: 88 }] };
                }
                return { results: [] };
              },
            });
            return createStmt([]);
          },
        } as any,
      };

      // 验证在 webhook 报 500 的情况下，任务仍正常完成、不向外抛异常
      await expect(
        cronWorker.scheduled({ cron: "*/15 * * * *", scheduledTime: Date.now() } as any, mockEnv, {} as any)
      ).resolves.not.toThrow();

      // 验证控制台输出了告警日志
      const alertWarn = warns.find((w) => w.includes("dns_pool_alert"));
      expect(alertWarn).toBeDefined();
      expect(alertWarn).toContain('"usageRatio":0.88');

      // 验证向 ALERT_WEBHOOK_URL 推送了 1 次
      expect(webhookCalls).toBe(1);
    } finally {
      console.warn = origWarn;
      globalThis.fetch = origFetch;
    }
  });

  // 用例 5：7 * * * * 上游正常同步与节点更新测试
  it("用例 5: 7 * * * * 上游正常同步与节点更新测试 (清理失效节点 DNS，迁移用户节点，清空 last_error)", async () => {
    const executedBatches: string[][] = [];
    const deletedDns: string[] = [];

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url: any, init: any) => {
      const urlStr = String(url);
      if (init?.method === "DELETE" && urlStr.includes("/dns_records/")) {
        deletedDns.push(urlStr.split("/dns_records/")[1]);
        return new Response(JSON.stringify({ success: true, result: { id: "del-id" } }), { status: 200 });
      }
      if (urlStr.includes("upstream.example.com")) {
        const subContent = "vless://u1@1.2.3.4:443?security=tls#🇺🇸 United States 01\nvless://u2@5.6.7.8:443?security=tls#🇸🇬 Singapore 01";
        return new Response(subContent, { status: 200 });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };

    try {
      const mockEnv: Env = {
        CF_API_TOKEN: "tok",
        DNS_SUFFIX: "ddda.dpdns.org",
        CF_ZONE_ID: "ed0b451b965e84addf0757d3bf2086ee",
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => createStmt(newArgs),
              run: async () => ({ success: true }),
              first: async () => {
                if (sql.includes("SELECT id, name, subscription_url FROM upstreams WHERE id=?")) {
                  return { id: 1, name: "Upstream 1", subscription_url: "https://upstream.example.com/sub" };
                }
                if (sql.includes("SELECT COUNT(*) AS count FROM nodes WHERE upstream_id=? AND active=1")) {
                  return { count: 2 };
                }
                return null;
              },
              all: async () => {
                if (sql.includes("SELECT id FROM upstreams WHERE enabled=1")) {
                  return { results: [{ id: 1 }] };
                }
                if (sql.includes("WHERE n.upstream_id=? AND n.active=0 AND d.status='active'")) {
                  // 返回 1 条失效节点需删 DNS
                  return { results: [{ id: 99, cloudflare_record_id: "cf-stale-1", zone_id: "ed0b451b965e84addf0757d3bf2086ee" }] };
                }
                if (sql.includes("SELECT DISTINCT u.id, u.name, u.upstream_id")) {
                  return { results: [] };
                }
                return { results: [] };
              },
              sql,
            });
            return createStmt([]);
          },
          batch: async (stmts: any[]) => {
            executedBatches.push(stmts.map((s) => s.sql));
            return stmts.map(() => ({ success: true }));
          },
        } as any,
      };

      await cronWorker.scheduled({ cron: "7 * * * *", scheduledTime: Date.now() } as any, mockEnv, {} as any);

      // 验证失效节点 DNS 被删除
      expect(deletedDns).toContain("cf-stale-1");

      // 验证 batch 中包含节点插入与迁移 SQL
      expect(executedBatches.length).toBeGreaterThanOrEqual(2);
      const allBatchSqls = executedBatches.flat();
      expect(allBatchSqls.some((s) => s.includes("UPDATE nodes SET active=0 WHERE upstream_id=?"))).toBe(true);
      expect(allBatchSqls.some((s) => s.includes("INSERT INTO nodes(upstream_id, fingerprint"))).toBe(true);
      expect(allBatchSqls.some((s) => s.includes("INSERT OR IGNORE INTO user_selected_nodes"))).toBe(true);
      expect(allBatchSqls.some((s) => s.includes("UPDATE upstreams SET last_synced_at=CURRENT_TIMESTAMP, last_error=NULL"))).toBe(true);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // 用例 6：7 * * * * Anti-Wipe 防误清空保护测试
  it("用例 6: 7 * * * * Anti-Wipe 防误清空保护测试 (原20节点本次解析出1个，拒绝覆盖并写 last_error)", async () => {
    let batchCalled = false;
    let lastErrorSaved: string | null = null;

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url: any) => {
      const urlStr = String(url);
      if (urlStr.includes("upstream.example.com")) {
        // 只返回 1 个节点（原 20 个）
        return new Response("vless://u1@1.2.3.4:443?security=tls#🇺🇸 US 01", { status: 200 });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };

    try {
      const mockEnv: Env = {
        CF_API_TOKEN: "tok",
        DNS_SUFFIX: "ddda.dpdns.org",
        CF_ZONE_ID: "ed0b451b965e84addf0757d3bf2086ee",
        UPSTREAM_ANTI_WIPE_MIN_PREV: "5",
        UPSTREAM_ANTI_WIPE_RATIO: "0.2",
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => {
                if (sql.includes("UPDATE upstreams SET last_error=? WHERE id=?")) {
                  lastErrorSaved = newArgs[0];
                }
                return createStmt(newArgs);
              },
              run: async () => ({ success: true }),
              first: async () => {
                if (sql.includes("SELECT id, name, subscription_url FROM upstreams WHERE id=?")) {
                  return { id: 1, name: "Upstream 1", subscription_url: "https://upstream.example.com/sub" };
                }
                if (sql.includes("SELECT COUNT(*) AS count FROM nodes WHERE upstream_id=? AND active=1")) {
                  return { count: 20 };
                }
                return null;
              },
              all: async () => {
                if (sql.includes("SELECT id FROM upstreams WHERE enabled=1")) {
                  return { results: [{ id: 1 }] };
                }
                return { results: [] };
              },
            });
            return createStmt([]);
          },
          batch: async () => {
            batchCalled = true;
            return [];
          },
        } as any,
      };

      await cronWorker.scheduled({ cron: "7 * * * *", scheduledTime: Date.now() } as any, mockEnv, {} as any);

      // 验证未执行任何批量更新/覆盖节点操作
      expect(batchCalled).toBe(false);

      // 验证 upstreams.last_error 写入了骤降保护原因
      expect(lastErrorSaved).toContain("上游节点骤降保护触发：原 20 个活跃节点，本次仅解析出 1 个，已拒绝覆盖");
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // 用例 7：*/5 * * * * 到期清理 + 429 熔断保护测试
  it("用例 7: */5 * * * * 到期清理 + 429 熔断保护测试 (第2次请求报429立即停止，未删完用户保留 active)", async () => {
    let cfCalls = 0;
    const executedStatusUpdates: Array<{ id: number; status: string }> = [];

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url: any, init: any) => {
      cfCalls++;
      if (cfCalls === 1) {
        return new Response(JSON.stringify({ success: true, result: { id: "rec-del-1" } }), { status: 200 });
      }
      // 第 2 次请求返回 HTTP 429
      return new Response(JSON.stringify({ success: false, errors: [{ code: 429, message: "Rate limit reached" }] }), {
        status: 429,
        headers: { "content-type": "application/json" },
      });
    };

    try {
      const mockEnv: Env = {
        CF_API_TOKEN: "tok",
        DNS_SUFFIX: "ddda.dpdns.org",
        CF_ZONE_ID: "ed0b451b965e84addf0757d3bf2086ee",
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => {
                if (sql.includes("UPDATE users SET status='expired' WHERE id=?")) {
                  executedStatusUpdates.push({ id: newArgs[0], status: "expired" });
                }
                return createStmt(newArgs);
              },
              run: async () => ({ success: true }),
              first: async () => null,
              all: async () => {
                if (sql.includes("FROM users WHERE status='active' AND julianday(expires_at) <= julianday('now')")) {
                  // 2 个到期用户，各有 2 条记录
                  return {
                    results: [
                      { id: 81, name: "Exp User 81", expires_at: "2026-10-01T00:00:00Z", status: "active", upstream_id: 1, node_limit: 2, plan_id: "trial_1d", dns_revision: 0 },
                      { id: 82, name: "Exp User 82", expires_at: "2026-10-02T00:00:00Z", status: "active", upstream_id: 1, node_limit: 2, plan_id: "trial_1d", dns_revision: 0 },
                    ],
                  };
                }
                if (sql.includes("FROM user_dns_records WHERE user_id=? AND status='active'")) {
                  const uid = args[0];
                  return {
                    results: [
                      { id: uid * 10 + 1, cloudflare_record_id: `rec-${uid}-1`, zone_id: "ed0b451b965e84addf0757d3bf2086ee" },
                      { id: uid * 10 + 2, cloudflare_record_id: `rec-${uid}-2`, zone_id: "ed0b451b965e84addf0757d3bf2086ee" },
                    ],
                  };
                }
                return { results: [] };
              },
            });
            return createStmt([]);
          },
        } as any,
      };

      await cronWorker.scheduled({ cron: "*/5 * * * *", scheduledTime: Date.now() } as any, mockEnv, {} as any);

      // 第 2 次 429 之后，停止后续 Cloudflare API 调用（总调用次数恰好为 2）
      expect(cfCalls).toBe(2);

      // 因为用户 81 的第 2 条记录被 429 中断未删完，绝不能被置为 status='expired'
      expect(executedStatusUpdates.length).toBe(0);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  // 用例 8：19:00 UTC 过期 30 天匿名试用用户清理保护测试
  it("用例 8: 19:00 UTC 过期 30 天匿名试用用户清理保护测试 (严格保护邮箱与付费用户，且仅清理匿名用户)", async () => {
    const executedBatches: string[][] = [];
    const deletedDns: string[] = [];

    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url: any, init: any) => {
      const urlStr = String(url);
      if (init?.method === "DELETE" && urlStr.includes("/dns_records/")) {
        deletedDns.push(urlStr.split("/dns_records/")[1]);
        return new Response(JSON.stringify({ success: true, result: { id: "dns-del" } }), { status: 200 });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    };

    try {
      const mockEnv: Env = {
        CF_API_TOKEN: "tok",
        DNS_SUFFIX: "ddda.dpdns.org",
        CF_ZONE_ID: "ed0b451b965e84addf0757d3bf2086ee",
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => createStmt(newArgs),
              run: async () => ({ success: true, meta: { changes: 10 } }),
              first: async () => null,
              all: async () => {
                if (sql.includes("FROM users u") && sql.includes("julianday(u.expires_at) < julianday('now', '-30 day')")) {
                  // SQL 过滤后仅命中第 1 类：过期 35 天匿名试用用户 #91
                  return {
                    results: [
                      { id: 91, name: "App Guest 91", expires_at: "2026-10-15T00:00:00Z" },
                    ],
                  };
                }
                if (sql.includes("FROM user_dns_records WHERE user_id = ? AND cloudflare_record_id IS NOT NULL")) {
                  const uid = args[0];
                  if (uid === 91) {
                    return {
                      results: [{ cloudflare_record_id: "cf-del-91", zone_id: "ed0b451b965e84addf0757d3bf2086ee" }],
                    };
                  }
                  return { results: [] };
                }
                if (sql.includes("FROM users WHERE status='active' AND julianday(expires_at) <= julianday('now')")) {
                  return { results: [] };
                }
                return { results: [] };
              },
              sql,
            });
            return createStmt([]);
          },
          batch: async (stmts: any[]) => {
            executedBatches.push(stmts.map((s) => s.sql));
            return stmts.map(() => ({ success: true }));
          },
        } as any,
      };

      // 模拟触发时间为 19:01 UTC
      const scheduledTime = Date.UTC(2026, 10, 21, 19, 1, 0);
      await cronWorker.scheduled({ cron: "*/5 * * * *", scheduledTime } as any, mockEnv, {} as any);

      // 验证第 1 类用户删除了 DNS
      expect(deletedDns).toContain("cf-del-91");

      // 验证第 1 类用户执行了完整 10 表删除 batch
      expect(executedBatches.length).toBe(1);
      expect(executedBatches[0]).toEqual([
        "DELETE FROM user_dns_records WHERE user_id = ?",
        "DELETE FROM user_selected_nodes WHERE user_id = ?",
        "DELETE FROM subscription_access_daily WHERE user_id = ?",
        "DELETE FROM app_sessions WHERE user_id = ?",
        "DELETE FROM app_devices WHERE user_id = ?",
        "DELETE FROM app_email_codes WHERE user_id = ?",
        "DELETE FROM app_user_profiles WHERE user_id = ?",
        "DELETE FROM app_order_grants WHERE user_id = ?",
        "DELETE FROM app_orders WHERE user_id = ?",
        "DELETE FROM users WHERE id = ?",
      ]);
    } finally {
      globalThis.fetch = origFetch;
    }
  });
});
