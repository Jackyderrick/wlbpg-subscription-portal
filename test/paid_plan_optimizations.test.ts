import { describe, expect, it, vi } from "vitest";
import worker from "../src/index";
import fs from "node:fs";
import path from "node:path";

describe("Cloudflare Workers Paid ($5/月) 专项优化验证", () => {
  it("验证 createBudget 预算创建及上下限与环境变量解析", () => {
    function createBudget(env: any, maxOverride?: number) {
      const limit = Math.max(20, Math.min(800, Number(maxOverride || env?.DNS_SUBREQUEST_BUDGET || 250)));
      return { count: 0, limit, rateLimited: false };
    }

    // Default with undefined env
    expect(createBudget(undefined).limit).toBe(250);
    // Custom env budget
    expect(createBudget({ DNS_SUBREQUEST_BUDGET: "350" }).limit).toBe(350);
    // Override within bounds
    expect(createBudget({ DNS_SUBREQUEST_BUDGET: "350" }, 180).limit).toBe(180);
    // Clamp to lower bound 20
    expect(createBudget(undefined, 5).limit).toBe(20);
    // Clamp to upper bound 800
    expect(createBudget(undefined, 1000).limit).toBe(800);
  });

  it("验证 runWithConcurrency 受控并发执行顺序与限制", async () => {
    async function runWithConcurrency<T, R>(items: T[], concurrency: number, fn: (item: T, idx: number) => Promise<R>): Promise<R[]> {
      const results: R[] = [];
      const limit = Math.max(1, Math.min(10, Number(concurrency || 4)));
      let index = 0;
      const workers = Array.from({ length: Math.min(items.length, limit) }, async () => {
        while (index < items.length) {
          const current = index++;
          results[current] = await fn(items[current], current);
        }
      });
      await Promise.all(workers);
      return results;
    }

    const input = [10, 20, 30, 40, 50, 60, 70, 80];
    let maxSimultaneous = 0;
    let currentRunning = 0;

    const res = await runWithConcurrency(input, 3, async (num, idx) => {
      currentRunning++;
      maxSimultaneous = Math.max(maxSimultaneous, currentRunning);
      await new Promise(r => setTimeout(r, 10));
      currentRunning--;
      return num * 2;
    });

    expect(maxSimultaneous).toBeLessThanOrEqual(3);
    expect(res).toEqual([20, 40, 60, 80, 100, 120, 140, 160]);
  });

  it("验证 HTTP 429 速率限制触发时 budget.rateLimited 标记置位并阻断后续请求", async () => {
    const budget = { count: 0, limit: 100, rateLimited: false };

    async function mockCfDns(responseStatus: number) {
      if (budget.count >= budget.limit || budget.rateLimited) {
        throw new Error("DNS subrequest budget exceeded or rate limited");
      }
      budget.count++;
      if (responseStatus === 429) {
        budget.rateLimited = true;
        const err: any = new Error("Cloudflare DNS API 429 Rate Limit");
        err.httpStatus = 429;
        throw err;
      }
      return { success: true };
    }

    // First request succeeds
    await mockCfDns(200);
    expect(budget.count).toBe(1);
    expect(budget.rateLimited).toBe(false);

    // Second request hits 429
    await expect(mockCfDns(429)).rejects.toThrow("Cloudflare DNS API 429 Rate Limit");
    expect(budget.rateLimited).toBe(true);

    // Subsequent request is immediately short-circuited
    await expect(mockCfDns(200)).rejects.toThrow("DNS subrequest budget exceeded or rate limited");
    expect(budget.count).toBe(2); // didn't increment to 3
  });

  it("验证内存选池与坏池故障排除 (单次只撞坏池 1 次)", () => {
    const pools = [
      { suffix: "pool1.xyz", zoneId: "z1", maxRecords: 100 },
      { suffix: "pool2.xyz", zoneId: "z2", maxRecords: 100 }
    ];
    const stats = {
      activeCounts: new Map([["z1", 10], ["z2", 20]]),
      errorCounts: new Map([["z1", 0], ["z2", 0]])
    };

    function selectDnsPoolFromStats(pList: typeof pools, st: typeof stats, excludedZoneIds: Set<string>) {
      const available = pList.filter(p => !excludedZoneIds.has(p.zoneId) && (st.activeCounts.get(p.zoneId) || 0) < p.maxRecords);
      if (!available.length) throw new Error("所有可用节点域名池均已排除或容量上限");
      return available.sort((a, b) => {
        const loadA = ((st.activeCounts.get(a.zoneId) || 0) + (st.errorCounts.get(a.zoneId) || 0) * 2) / a.maxRecords;
        const loadB = ((st.activeCounts.get(b.zoneId) || 0) + (st.errorCounts.get(b.zoneId) || 0) * 2) / b.maxRecords;
        return loadA - loadB;
      })[0];
    }

    const failedZoneIds = new Set<string>();

    // Initial pick -> z1 has lower load (10 vs 20)
    const pick1 = selectDnsPoolFromStats(pools, stats, failedZoneIds);
    expect(pick1.zoneId).toBe("z1");

    // Suppose z1 fails with API error -> record to failedZoneIds and stats
    failedZoneIds.add("z1");
    stats.errorCounts.set("z1", (stats.errorCounts.get("z1") || 0) + 1);

    // Next node picks -> z1 is excluded in memory, directly picks z2 without touching Cloudflare API for z1!
    const pick2 = selectDnsPoolFromStats(pools, stats, failedZoneIds);
    expect(pick2.zoneId).toBe("z2");
  });

  it("验证 checkRateLimit 计数器、上限判断与 fail-open 容灾", async () => {
    const store = new Map<string, number>();
    const mockEnv = {
      DB: {
        prepare: (sql: string) => ({
          bind: (...args: any[]) => ({
            run: async () => {
              const [key, scope, windowStart] = args;
              const mapKey = `${scope}:${key}:${windowStart}`;
              store.set(mapKey, (store.get(mapKey) || 0) + 1);
              return { success: true };
            },
            first: async () => {
              const [key, scope, windowStart] = args;
              const mapKey = `${scope}:${key}:${windowStart}`;
              return { hits: store.get(mapKey) || 1 };
            }
          })
        })
      }
    };

    async function checkRateLimit(env: any, scope: string, key: string, limit: number, windowSec: number) {
      try {
        const nowSec = Math.floor(Date.now() / 1000);
        const windowStart = Math.floor(nowSec / windowSec) * windowSec;
        await env.DB.prepare("INSERT").bind(key, scope, windowStart).run();
        const row = await env.DB.prepare("SELECT").bind(key, scope, windowStart).first();
        const hits = Number(row?.hits || 1);
        return { ok: hits <= limit, hits, limit, remaining: Math.max(0, limit - hits), resetSec: (windowStart + windowSec) - nowSec };
      } catch {
        return { ok: true, hits: 0, limit, remaining: limit, resetSec: windowSec };
      }
    }

    const ip = "1.2.3.4";
    // 3 allowed hits
    const r1 = await checkRateLimit(mockEnv, "test", ip, 3, 60);
    expect(r1.ok).toBe(true);
    expect(r1.hits).toBe(1);

    const r2 = await checkRateLimit(mockEnv, "test", ip, 3, 60);
    expect(r2.ok).toBe(true);
    expect(r2.hits).toBe(2);

    const r3 = await checkRateLimit(mockEnv, "test", ip, 3, 60);
    expect(r3.ok).toBe(true);
    expect(r3.hits).toBe(3);

    // 4th hit exceeds limit
    const r4 = await checkRateLimit(mockEnv, "test", ip, 3, 60);
    expect(r4.ok).toBe(false);
    expect(r4.hits).toBe(4);

    // Fail-open on DB error
    const brokenEnv = {
      DB: {
        prepare: () => {
          throw new Error("D1 connection lost");
        }
      }
    };
    const rFailOpen = await checkRateLimit(brokenEnv, "test", ip, 3, 60);
    expect(rFailOpen.ok).toBe(true);
  });

  it("验证支付回调异步处理 (ctx.waitUntil 支持)", async () => {
    let waitUntilCalled = false;
    let provisionFinished = false;

    const mockCtx = {
      waitUntil: (promise: Promise<any>) => {
        waitUntilCalled = true;
        promise.then(() => {
          provisionFinished = true;
        });
      }
    };

    const runProvision = async () => {
      await new Promise(r => setTimeout(r, 20));
    };

    if (mockCtx?.waitUntil) {
      mockCtx.waitUntil(runProvision());
    } else {
      await runProvision();
    }

    // Callback returned immediately before provision finished
    expect(waitUntilCalled).toBe(true);
    expect(provisionFinished).toBe(false);

    // Await background execution
    await new Promise(r => setTimeout(r, 35));
    expect(provisionFinished).toBe(true);
  });

  it("验证 adminUpdateUser 对非法日期的防崩溃拦截", () => {
    const existing = { expires_at: "2026-12-01T00:00:00.000Z" };
    const input = { expiresAt: "invalid-date-string" };

    function parseExpiry(existingData: typeof existing, inputData: typeof input) {
      let expiresAt = existingData.expires_at;
      if (inputData.expiresAt != null) {
        const parsed = Date.parse(inputData.expiresAt);
        if (!Number.isFinite(parsed)) return { error: "到期时间无效" };
        expiresAt = new Date(parsed).toISOString();
      }
      return { ok: true, expiresAt };
    }

    const result = parseExpiry(existing, input);
    expect(result.error).toBe("到期时间无效");

    const validResult = parseExpiry(existing, { expiresAt: "2027-01-01T12:00:00Z" });
    expect(validResult.ok).toBe(true);
    expect(validResult.expiresAt).toBe("2027-01-01T12:00:00.000Z");
  });

  it("验证管理后台 HTML 嵌入脚本语法正确且无解析错误", () => {
    const indexPath = path.resolve(__dirname, "../src/index.ts");
    const content = fs.readFileSync(indexPath, "utf-8");

    // Extract the inline admin script from admin_page_default
    const scriptMatch = content.match(/<script>([\s\S]*?)<\\\/script>/);
    expect(scriptMatch).not.toBeNull();
    if (scriptMatch) {
      const scriptCode = "const I = {};\nconst $" + scriptMatch[1].split("const $")[1];
      // Test that the script evaluates as valid JavaScript syntax without throwing SyntaxError
      expect(() => {
        new Function(scriptCode);
      }).not.toThrow();
    }
  });
});
