import { describe, expect, it } from "vitest";
import worker, { purgeExpiredTrialUsers } from "../src/index";

describe("定期清理过期试用用户（满30天且未绑邮箱、无付费）功能验证", () => {
  it("验证 purgeExpiredTrialUsers 正确识别、删除 DNS 并级联清理数据库记录", async () => {
    const executedBatches: string[][] = [];
    const deletedDnsList: Array<{ zoneId: string; recordId: string }> = [];

    // Mock fetch to simulate Cloudflare delete DNS response
    const origFetch = globalThis.fetch;
    globalThis.fetch = async (url: any, init: any) => {
      const urlStr = String(url);
      if (init?.method === "DELETE" && urlStr.includes("/dns_records/")) {
        deletedDnsList.push({
          zoneId: urlStr.split("/zones/")[1]?.split("/")[0],
          recordId: urlStr.split("/dns_records/")[1]
        });
        return new Response(JSON.stringify({ success: true, result: { id: "dns-deleted" } }), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { "content-type": "application/json" } });
    };

    try {
      const mockEnv: any = {
        CF_ZONE_ID: "ed0b451b965e84addf0757d3bf2086ee",
        CF_API_TOKEN: "mock-token",
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => createStmt(newArgs),
              run: async () => ({ success: true, meta: { changes: 1 } }),
              all: async () => {
                if (sql.includes("FROM users u") && sql.includes("expires_at < datetime('now', '-30 day')")) {
                  // 返回 2 位满足清理条件的用户
                  return {
                    results: [
                      { id: 101, name: "App Guest 101", expires_at: "2026-10-01T00:00:00Z" },
                      { id: 102, name: "Web Guest 102", expires_at: "2026-10-02T00:00:00Z" }
                    ]
                  };
                }
                if (sql.includes("FROM user_dns_records WHERE user_id = ?")) {
                  const uid = args[0];
                  if (uid === 101) {
                    return {
                      results: [
                        { cloudflare_record_id: "cf-rec-101-a", zone_id: "zone-1" },
                        { cloudflare_record_id: "cf-rec-101-b", zone_id: "zone-2" }
                      ]
                    };
                  }
                  if (uid === 102) {
                    return {
                      results: [
                        { cloudflare_record_id: "cf-rec-102-a", zone_id: "zone-1" }
                      ]
                    };
                  }
                  return { results: [] };
                }
                return { results: [] };
              },
              sql
            });
            return createStmt([]);
          },
          batch: async (statements: any[]) => {
            executedBatches.push(statements.map(s => s.sql));
            return statements.map(() => ({ success: true }));
          }
        }
      };

      const res = await purgeExpiredTrialUsers(mockEnv, { limit: 50 });
      expect(res.purged).toBe(2);
      expect(res.dnsDeleted).toBe(3);

      // 验证远程 DNS 删除
      expect(deletedDnsList.length).toBe(3);
      expect(deletedDnsList).toContainEqual({ zoneId: "zone-1", recordId: "cf-rec-101-a" });
      expect(deletedDnsList).toContainEqual({ zoneId: "zone-2", recordId: "cf-rec-101-b" });
      expect(deletedDnsList).toContainEqual({ zoneId: "zone-1", recordId: "cf-rec-102-a" });

      // 验证本地数据库清理了全部 10 个级联语句
      expect(executedBatches.length).toBe(2);
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
        "DELETE FROM users WHERE id = ?"
      ]);
    } finally {
      globalThis.fetch = origFetch;
    }
  });

  it("验证 API POST /api/users/purge-expired 权限拦截与执行", async () => {
    let purgedCalled = false;
    const mockEnv: any = {
      ADMIN_SECRET: "secret-key",
      DB: {
        prepare: (sql: string) => {
          const createStmt = (args: any[]) => ({
            bind: (...newArgs: any[]) => createStmt(newArgs),
            run: async () => ({ success: true }),
            all: async () => {
              if (sql.includes("FROM users u") && sql.includes("expires_at < datetime('now', '-30 day')")) {
                purgedCalled = true;
                return { results: [] };
              }
              return { results: [] };
            }
          });
          return createStmt([]);
        },
        batch: async () => []
      }
    };

    // 1. 未授权请求返回 401
    const unauthReq = new Request("https://app.5858188.xyz/api/users/purge-expired", {
      method: "POST"
    });
    const unauthRes = await worker.fetch(unauthReq, mockEnv, {} as any);
    expect(unauthRes.status).toBe(401);

    // 2. 授权请求正常执行
    const authReq = new Request("https://app.5858188.xyz/api/users/purge-expired", {
      method: "POST",
      headers: {
        authorization: "Bearer secret-key"
      }
    });
    const authRes = await worker.fetch(authReq, mockEnv, {} as any);
    expect(authRes.status).toBe(200);
    const data = await authRes.json() as any;
    expect(data.ok).toBe(true);
    expect(data.purged).toBe(0);
    expect(data.message).toContain("当前没有满足清理条件的过期试用用户");
    expect(purgedCalled).toBe(true);
  });

  it("验证 worker.scheduled 每天凌晨触发 access_log 与 purge_expired 任务", async () => {
    const logs: string[] = [];
    const origLog = console.log;
    console.log = (...args: any[]) => logs.push(args.join(" "));

    try {
      const mockEnv: any = {
        DB: {
          prepare: (sql: string) => {
            const createStmt = (args: any[]) => ({
              bind: (...newArgs: any[]) => createStmt(newArgs),
              run: async () => ({ success: true, meta: { changes: 15 } }),
              all: async () => {
                if (sql.includes("FROM users u") && sql.includes("expires_at < datetime('now', '-30 day')")) {
                  return { results: [] };
                }
                if (sql.includes("FROM users WHERE status='active' AND expires_at<=datetime('now')")) {
                  return { results: [] };
                }
                return { results: [] };
              }
            });
            return createStmt([]);
          },
          batch: async () => []
        }
      };

      // 模拟当前时间为 UTC 19:02 (北京时间凌晨 03:02)
      const mockDate = new Date("2026-11-21T19:02:00Z");
      const OrigDate = globalThis.Date;
      (globalThis as any).Date = class extends OrigDate {
        constructor() {
          super();
          return mockDate;
        }
        static now() {
          return mockDate.getTime();
        }
        static parse(str: string) {
          return OrigDate.parse(str);
        }
      };

      try {
        await worker.scheduled({ cron: "*/5 * * * *" } as any, mockEnv, {} as any);
      } finally {
        globalThis.Date = OrigDate;
      }

      const accessLog = logs.find(l => l.includes("access_log_retention_complete"));
      expect(accessLog).toBeDefined();
      expect(accessLog).toContain('"deleted":15');

      const purgeLog = logs.find(l => l.includes("purge_expired_users_complete"));
      expect(purgeLog).toBeDefined();
      expect(purgeLog).toContain('"purged":0');

      const expiryLog = logs.find(l => l.includes("expiry_complete"));
      expect(expiryLog).toBeDefined();
    } finally {
      console.log = origLog;
    }
  });
});
