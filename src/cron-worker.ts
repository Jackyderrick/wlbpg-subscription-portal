import { parseSubscription, dnsType } from "./parser";

export interface Env {
  DB: D1Database;
  CF_API_TOKEN: string;
  DNS_SUFFIX: string;
  CF_ZONE_ID: string;
  DNS_POOLS?: string;
  DNS_SUBREQUEST_BUDGET?: string;
  DNS_CONCURRENCY?: string;
  UPSTREAM_ANTI_WIPE_MIN_PREV?: string;
  UPSTREAM_ANTI_WIPE_RATIO?: string;
  CRON_TRIGGER_SECRET?: string;
  ALERT_WEBHOOK_URL?: string;
}

export interface DnsPool {
  suffix: string;
  zoneId: string;
  maxRecords: number;
}

export interface Budget {
  count: number;
  limit: number;
  rateLimited: boolean;
}

interface PoolStats {
  activeCounts: Map<string, number>;
  errorCounts: Map<string, number>;
}

interface UserRow {
  id: number;
  name: string;
  upstream_id: number;
  expires_at: string;
  status: string;
  node_limit: number;
  plan_id: string | null;
  dns_revision: number;
}

interface NodeRow {
  id: number;
  fingerprint: string;
  name: string;
  protocol: string;
  original_server: string;
  original_uri: string;
}

interface CfApiError extends Error {
  cfErrors?: Array<{ code?: number; message?: string }>;
  httpStatus?: number;
}

export function localizedNodeName(name: string, upstreamId: number): string {
  const countries: Array<[string, string]> = [
    ["United States", "美国"],
    ["Malaysia", "马来西亚"],
    ["Singapore", "新加坡"],
    ["Japan", "日本"],
    ["Korea", "韩国"],
    ["Netherlands", "荷兰"],
    ["United Kingdom", "英国"],
    ["Hong Kong", "香港"],
    ["Taiwan", "台湾"],
    ["Germany", "德国"],
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

export function normalizePlanId(planId: string | null | undefined): string {
  const id = String(planId || "").trim();
  if (!id) return "trial_1d";
  if (id === "standard_monthly" || id === "standard_quarterly" || id === "standard_yearly") {
    return "advanced_monthly";
  }
  return id;
}

export function decodeBase64Utf8(b64: string): string {
  const normalized = b64.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function secureEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const va = new Uint8Array(ha);
  const vb = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

export function createBudget(env: Partial<Env>, maxOverride?: number): Budget {
  const limit = Math.max(20, Math.min(800, Number(maxOverride ?? env.DNS_SUBREQUEST_BUDGET ?? 250)));
  return { count: 0, limit, rateLimited: false };
}

export async function runWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const limit = Math.max(1, Math.min(10, Number(concurrency || 4)));
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const idx = cursor++;
      results[idx] = await fn(items[idx]);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

export function isBudgetAbort(budget: Budget, error?: unknown): boolean {
  if (budget.rateLimited) return true;
  if (!error) return false;
  const msg = error instanceof Error ? error.message : String(error);
  return msg.includes("budget exceeded") || msg.includes("subrequest") || (error as CfApiError).httpStatus === 429;
}

export async function cfDns(
  env: Env,
  zoneId: string,
  method: string,
  path: string,
  payload: unknown,
  budget: Budget
): Promise<any> {
  if (budget.count >= budget.limit || budget.rateLimited) {
    throw new Error("DNS subrequest budget exceeded or rate limited");
  }
  budget.count++;

  const url = `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records${path}`;
  const init: RequestInit = {
    method,
    headers: {
      authorization: `Bearer ${env.CF_API_TOKEN}`,
      "content-type": "application/json",
    },
    signal: AbortSignal.timeout(15_000),
  };
  if (payload !== undefined) {
    init.body = JSON.stringify(payload);
  }

  const response = await fetch(url, init);
  if (response.status === 429) {
    budget.rateLimited = true;
    const err: CfApiError = new Error("Rate limit exceeded");
    err.httpStatus = 429;
    err.cfErrors = [{ code: 429, message: "Rate limit exceeded" }];
    throw err;
  }

  const text = await response.text();
  let result: any = null;
  try {
    result = JSON.parse(text);
  } catch {
    const err: CfApiError = new Error(`Cloudflare API invalid JSON response (status ${response.status})`);
    err.httpStatus = response.status;
    throw err;
  }

  if (!response.ok || result?.success !== true) {
    const err: CfApiError = new Error(result?.errors?.[0]?.message || `Cloudflare API error (${response.status})`);
    err.cfErrors = result?.errors || [];
    err.httpStatus = response.status;
    throw err;
  }

  return result;
}

export async function createDns(
  env: Env,
  pool: DnsPool,
  hostname: string,
  server: string,
  budget: Budget
): Promise<string> {
  const payload = {
    type: dnsType(server),
    name: hostname,
    content: server,
    ttl: 60,
    proxied: false,
    comment: "dns-sub-share managed",
  };

  try {
    const res = await cfDns(env, pool.zoneId, "POST", "", payload, budget);
    return String(res.result.id);
  } catch (error: any) {
    const cfCodes = (error?.cfErrors || []).map((e: any) => Number(e.code));
    if (cfCodes.includes(81053) || cfCodes.includes(81057) || cfCodes.includes(81058)) {
      const searchRes = await cfDns(env, pool.zoneId, "GET", `?name=${encodeURIComponent(hostname)}`, undefined, budget);
      const existing = searchRes?.result?.[0];
      if (existing?.id) {
        await cfDns(env, pool.zoneId, "PATCH", `/${existing.id}`, payload, budget);
        return String(existing.id);
      }
    }
    throw error;
  }
}

export async function deleteDns(
  env: Env,
  zoneId: string,
  recordId: string | null | undefined,
  budget: Budget
): Promise<void> {
  if (!recordId) return;
  try {
    await cfDns(env, zoneId, "DELETE", `/${recordId}`, undefined, budget);
  } catch (error: any) {
    const cfCodes = (error?.cfErrors || []).map((e: any) => Number(e.code));
    if (error?.httpStatus === 404 || cfCodes.includes(81044)) {
      return;
    }
    throw error;
  }
}

export function dnsPools(env: Partial<Env>): DnsPool[] {
  const fallback: DnsPool[] = [{ suffix: env.DNS_SUFFIX || "ddda.dpdns.org", zoneId: env.CF_ZONE_ID || "", maxRecords: 190 }];
  try {
    const parsed = JSON.parse(env.DNS_POOLS || "[]");
    if (!Array.isArray(parsed)) return fallback;
    const pools = parsed.filter(
      (pool: any): pool is DnsPool =>
        typeof pool?.suffix === "string" &&
        /^[a-z0-9.-]+$/i.test(pool.suffix) &&
        typeof pool?.zoneId === "string" &&
        /^[a-f0-9]{32}$/i.test(pool.zoneId) &&
        Number.isInteger(pool.maxRecords) &&
        pool.maxRecords > 0
    );
    return pools.length ? pools : fallback;
  } catch {
    return fallback;
  }
}

export async function loadDnsPoolStats(env: Env): Promise<PoolStats> {
  const usage = await env.DB.prepare(
    "SELECT COALESCE(zone_id, ?) zone_id, status, COUNT(*) total FROM user_dns_records GROUP BY COALESCE(zone_id, ?), status"
  )
    .bind(env.CF_ZONE_ID, env.CF_ZONE_ID)
    .all<{ zone_id: string; status: string; total: number }>();

  const activeCounts = new Map<string, number>();
  const errorCounts = new Map<string, number>();
  for (const row of usage.results || []) {
    if (row.status === "active") activeCounts.set(row.zone_id, Number(row.total));
    else if (row.status === "error") errorCounts.set(row.zone_id, Number(row.total));
  }
  return { activeCounts, errorCounts };
}

export function selectDnsPoolFromStats(
  pools: DnsPool[],
  stats: PoolStats,
  excludedZoneIds: Set<string> = new Set()
): DnsPool {
  const available = pools.filter(
    (p) => !excludedZoneIds.has(p.zoneId) && (stats.activeCounts.get(p.zoneId) || 0) < p.maxRecords
  );
  if (!available.length) throw new Error("所有可用节点域名池均已排除或容量上限");
  return available.sort((a, b) => {
    const loadA = ((stats.activeCounts.get(a.zoneId) || 0) + (stats.errorCounts.get(a.zoneId) || 0) * 2) / a.maxRecords;
    const loadB = ((stats.activeCounts.get(b.zoneId) || 0) + (stats.errorCounts.get(b.zoneId) || 0) * 2) / b.maxRecords;
    return loadA - loadB;
  })[0];
}

export async function provisionUser(
  env: Env,
  user: UserRow,
  { prune = true, budget }: { prune?: boolean; budget: Budget }
): Promise<{ created: number; pruned: number }> {
  const concurrency = Math.max(1, Math.min(5, Number(env.DNS_CONCURRENCY || 4)));
  const targetLimit = Math.max(1, Math.min(20, Number(user.node_limit || 10)));
  const planId = normalizePlanId(user.plan_id);

  const selectedNodeRows = await env.DB.prepare(
    "SELECT node_id FROM user_selected_nodes WHERE user_id=?"
  )
    .bind(user.id)
    .all<{ node_id: number }>();
  let rawAllowedIds = (selectedNodeRows.results || []).map((r) => Number(r.node_id));

  if (!rawAllowedIds.length) {
    try {
      const planNodeRows = await env.DB.prepare(
        "SELECT node_id FROM plan_selected_nodes WHERE plan_id=?"
      )
        .bind(planId)
        .all<{ node_id: number }>();
      rawAllowedIds = (planNodeRows.results || []).map((r) => Number(r.node_id));
    } catch {}
  }

  let allowedIds: number[] = [];
  if (rawAllowedIds.length > 0) {
    const placeholders = rawAllowedIds.map(() => "?").join(",");
    const resolved = await env.DB.prepare(
      `SELECT DISTINCT n_act.id FROM nodes n_sel
       JOIN nodes n_act ON (n_act.id = n_sel.id OR (n_act.upstream_id = n_sel.upstream_id AND n_act.name = n_sel.name))
       WHERE n_sel.id IN (${placeholders}) AND n_act.active = 1`
    )
      .bind(...rawAllowedIds)
      .all<{ id: number }>();
    allowedIds = (resolved.results || []).map((r) => Number(r.id));
  }

  // 清理 error 记录时：先一条 SQL 批量把 status='error' AND (cloudflare_record_id IS NULL OR cloudflare_record_id='') 置为 deleted
  try {
    await env.DB.prepare(
      "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE user_id=? AND status='error' AND (cloudflare_record_id IS NULL OR cloudflare_record_id='')"
    )
      .bind(user.id)
      .run();
  } catch {}

  // 仅对 status='error' AND cloudflare_record_id IS NOT NULL 的记录调 deleteDns（严禁扫描 status='deleted' 历史行！）
  const errorRows = await env.DB.prepare(
    "SELECT id, node_id, cloudflare_record_id, zone_id FROM user_dns_records WHERE user_id=? AND status='error' AND cloudflare_record_id IS NOT NULL AND cloudflare_record_id != ''"
  )
    .bind(user.id)
    .all<{ id: number; node_id: number; cloudflare_record_id: string; zone_id: string | null }>();

  await runWithConcurrency(errorRows.results || [], concurrency, async (erow) => {
    if (budget.count >= budget.limit || budget.rateLimited) return;
    try {
      await deleteDns(env, erow.zone_id || env.CF_ZONE_ID, erow.cloudflare_record_id, budget);
      await env.DB.prepare(
        "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE id=?"
      )
        .bind(erow.id)
        .run();
    } catch {}
  });

  // 严禁使用 ORDER BY id ASC LIMIT 覆盖用户已有有效节点：先查用户现有 status='active' 记录
  const activeRows = await env.DB.prepare(
    "SELECT id, node_id, cloudflare_record_id, zone_id FROM user_dns_records WHERE user_id=? AND status='active' ORDER BY created_at, id"
  )
    .bind(user.id)
    .all<{ id: number; node_id: number; cloudflare_record_id: string | null; zone_id: string | null }>();

  let active = activeRows.results || [];
  let disallowedRemoved = 0;

  // 仅当 rawAllowedIds.length > 0 且 prune=true 时，删掉不在 allowedIds 里的违规 active 记录
  if (prune && rawAllowedIds.length > 0) {
    const disallowed = active.filter((row) => !allowedIds.includes(Number(row.node_id)));
    const kept = active.filter((row) => allowedIds.includes(Number(row.node_id)));
    if (disallowed.length > 0) {
      await runWithConcurrency(disallowed, concurrency, async (row) => {
        if (budget.count >= budget.limit || budget.rateLimited) {
          kept.push(row);
          return;
        }
        try {
          await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "", budget);
          await env.DB.prepare(
            "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE id=?"
          )
            .bind(row.id)
            .run();
          disallowedRemoved++;
        } catch (error) {
          if (!isBudgetAbort(budget, error)) {
            await env.DB.prepare(
              "UPDATE user_dns_records SET status='error', last_error=? WHERE id=?"
            )
              .bind(error instanceof Error ? error.message : String(error), row.id)
              .run();
          }
        }
      });
    }
    active = kept;
  }

  async function pruneExtras(): Promise<number> {
    if (!prune) return 0;
    const latest = await env.DB.prepare(
      "SELECT id, cloudflare_record_id, zone_id FROM user_dns_records WHERE user_id=? AND status='active' ORDER BY created_at, id"
    )
      .bind(user.id)
      .all<{ id: number; cloudflare_record_id: string | null; zone_id: string | null }>();
    const extras = (latest.results || []).slice(targetLimit);
    let removed = 0;
    await runWithConcurrency(extras, concurrency, async (row) => {
      if (budget.count >= budget.limit || budget.rateLimited) return;
      try {
        await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "", budget);
        await env.DB.prepare(
          "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE id=?"
        )
          .bind(row.id)
          .run();
        removed++;
      } catch (error) {
        if (!isBudgetAbort(budget, error)) {
          await env.DB.prepare(
            "UPDATE user_dns_records SET status='error', last_error=? WHERE id=?"
          )
            .bind(error instanceof Error ? error.message : String(error), row.id)
            .run();
        }
      }
    });
    return removed;
  }

  // 超上限时删超出 targetLimit 的多余记录
  if (active.length >= targetLimit) {
    const extraPruned = await pruneExtras();
    return { created: 0, pruned: disallowedRemoved + extraPruned };
  }

  // 计算缺口 fill = targetLimit - active.length，若 fill <= 0 直接返回
  const fill = targetLimit - active.length;
  if (fill <= 0) {
    const extraPruned = await pruneExtras();
    return { created: 0, pruned: disallowedRemoved + extraPruned };
  }

  // 仅查询 NOT IN (activeNodeIds) 的活跃节点 ORDER BY RANDOM() LIMIT fill
  const activeNodeIds = active.map((row) => Number(row.node_id));
  const excludeSql = activeNodeIds.length ? ` AND id NOT IN (${activeNodeIds.map(() => "?").join(",")})` : "";
  let nodes: { results?: NodeRow[] };

  if (rawAllowedIds.length > 0) {
    if (allowedIds.length > 0) {
      nodes = await env.DB.prepare(
        `SELECT id, fingerprint, name, protocol, original_server, original_uri FROM nodes
         WHERE active=1 AND id IN (${allowedIds.map(() => "?").join(",")})${excludeSql}
         ORDER BY RANDOM() LIMIT ?`
      )
        .bind(...allowedIds, ...activeNodeIds, fill)
        .all<NodeRow>();
    } else {
      nodes = { results: [] };
    }
  } else {
    nodes = await env.DB.prepare(
      `SELECT id, fingerprint, name, protocol, original_server, original_uri FROM nodes
       WHERE upstream_id=? AND active=1${excludeSql}
       ORDER BY RANDOM() LIMIT ?`
    )
      .bind(user.upstream_id, ...activeNodeIds, fill)
      .all<NodeRow>();
  }

  const allPools = dnsPools(env);
  const poolStats = await loadDnsPoolStats(env);
  const failedZoneIds = new Set<string>();
  let created = 0;

  // 使用 runWithConcurrency 并发创建（保持外层共享 failedZoneIds、预占回滚与 abortedByBudget 保护不变）
  await runWithConcurrency(nodes.results || [], concurrency, async (node) => {
    if (budget.count >= budget.limit || budget.rateLimited) return;
    const existing = await env.DB.prepare(
      "SELECT id, status FROM user_dns_records WHERE user_id=? AND node_id=?"
    )
      .bind(user.id, node.id)
      .first<{ id: number; status: string }>();
    if (existing?.status === "active") return;

    const label = `u${user.id}-r${user.dns_revision}-${node.fingerprint.slice(0, 10)}-${node.id}`;
    let recordCreated = false;
    let abortedByBudget = false;
    let lastErrorMsg = "";
    let lastZoneId = "";
    let lastHostname = "";

    while (failedZoneIds.size < allPools.length) {
      if (budget.count >= budget.limit || budget.rateLimited) {
        abortedByBudget = true;
        break;
      }
      let pool: DnsPool;
      try {
        pool = selectDnsPoolFromStats(allPools, poolStats, failedZoneIds);
      } catch {
        break;
      }

      poolStats.activeCounts.set(pool.zoneId, (poolStats.activeCounts.get(pool.zoneId) || 0) + 1);
      lastZoneId = pool.zoneId;
      lastHostname = `${label}.${pool.suffix}`;

      try {
        const recordId = await createDns(env, pool, lastHostname, node.original_server, budget);
        await env.DB.prepare(
          `INSERT INTO user_dns_records(user_id, node_id, hostname, record_type, record_content, cloudflare_record_id, zone_id, status, last_error)
           VALUES(?,?,?,?,?,?,?, 'active', NULL)
           ON CONFLICT(user_id, node_id) DO UPDATE SET
             hostname=excluded.hostname,
             record_type=excluded.record_type,
             record_content=excluded.record_content,
             cloudflare_record_id=excluded.cloudflare_record_id,
             zone_id=excluded.zone_id,
             status='active',
             last_error=NULL`
        )
          .bind(user.id, node.id, lastHostname, dnsType(node.original_server), node.original_server, recordId, pool.zoneId)
          .run();
        created++;
        recordCreated = true;
        break;
      } catch (error: any) {
        poolStats.activeCounts.set(pool.zoneId, Math.max(0, (poolStats.activeCounts.get(pool.zoneId) || 1) - 1));
        failedZoneIds.add(pool.zoneId);
        poolStats.errorCounts.set(pool.zoneId, (poolStats.errorCounts.get(pool.zoneId) || 0) + 1);
        lastErrorMsg = error instanceof Error ? error.message : String(error);
        if (budget.rateLimited || lastErrorMsg.includes("budget exceeded") || error?.httpStatus === 429) {
          abortedByBudget = true;
          break;
        }
      }
    }

    if (!recordCreated && !abortedByBudget) {
      await env.DB.prepare(
        `INSERT INTO user_dns_records(user_id, node_id, hostname, record_type, record_content, cloudflare_record_id, zone_id, status, last_error)
         VALUES(?,?,?,?,?,NULL,?, 'error',?)
         ON CONFLICT(user_id, node_id) DO UPDATE SET
           hostname=excluded.hostname,
           record_type=excluded.record_type,
           record_content=excluded.record_content,
           cloudflare_record_id=NULL,
           zone_id=excluded.zone_id,
           status='error',
           last_error=excluded.last_error`
      )
        .bind(
          user.id,
          node.id,
          lastHostname || `${label}.${allPools[0].suffix}`,
          dnsType(node.original_server),
          node.original_server,
          lastZoneId || allPools[0].zoneId,
          lastErrorMsg || "DNS分配失败"
        )
        .run();
    }
  });

  const extraPruned = await pruneExtras();
  return { created, pruned: disallowedRemoved + extraPruned };
}

export async function deprovisionUser(
  env: Env,
  userId: number,
  budget: Budget
): Promise<{ removed: number; failed: number; aborted: boolean }> {
  // 对无 cloudflare_record_id 的 error 行直接置为 deleted（不消耗 budget）
  try {
    await env.DB.prepare(
      "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE user_id=? AND status='error' AND (cloudflare_record_id IS NULL OR cloudflare_record_id='')"
    )
      .bind(userId)
      .run();
  } catch {}

  const records = await env.DB.prepare(
    "SELECT id, cloudflare_record_id, zone_id, status FROM user_dns_records WHERE user_id=? AND status IN ('active', 'error')"
  )
    .bind(userId)
    .all<{ id: number; cloudflare_record_id: string | null; zone_id: string | null; status: string }>();

  let removed = 0;
  let failed = 0;
  let aborted = false;

  for (const row of records.results || []) {
    if (!row.cloudflare_record_id) {
      await env.DB.prepare(
        "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE id=?"
      )
        .bind(row.id)
        .run();
      removed++;
      continue;
    }

    if (budget.count >= budget.limit || budget.rateLimited) {
      aborted = true;
      break;
    }
    try {
      await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id, budget);
      await env.DB.prepare(
        "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE id=?"
      )
        .bind(row.id)
        .run();
      removed++;
    } catch (error) {
      if (isBudgetAbort(budget, error)) {
        aborted = true;
        break;
      }
      failed++;
      await env.DB.prepare(
        "UPDATE user_dns_records SET status='error', last_error=? WHERE id=?"
      )
        .bind(error instanceof Error ? error.message : String(error), row.id)
        .run();
    }
  }

  return { removed, failed, aborted };
}

export async function sendAlert(env: Env, payload: Record<string, unknown>): Promise<void> {
  if (!env.ALERT_WEBHOOK_URL) return;
  try {
    await fetch(env.ALERT_WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        worker: "dns-sub-share-cron",
        timestamp: new Date().toISOString(),
        ...payload,
      }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch (err) {
    console.error(JSON.stringify({ event: "send_alert_error", error: err instanceof Error ? err.message : String(err) }));
  }
}

export async function syncUpstream(env: Env, upstreamId: number): Promise<number> {
  const upstream = await env.DB.prepare(
    "SELECT id, name, subscription_url FROM upstreams WHERE id=?"
  )
    .bind(upstreamId)
    .first<{ id: number; name: string; subscription_url: string }>();
  if (!upstream) throw new Error("上游不存在");

  let nodes: Array<{ fingerprint: string; name: string; protocol: string; server: string; originalUri: string }> = [];

  if (upstream.subscription_url.startsWith("manual://")) {
    const b64 = upstream.subscription_url.slice(9).trim();
    if (!b64 || b64 === "stored") {
      const activeCountRow = await env.DB.prepare(
        "SELECT COUNT(*) AS count FROM nodes WHERE upstream_id=? AND active=1"
      )
        .bind(upstreamId)
        .first<{ count: number }>();
      const count = Number(activeCountRow?.count ?? 0);
      await env.DB.prepare(
        "UPDATE upstreams SET last_synced_at=CURRENT_TIMESTAMP, last_error=NULL WHERE id=?"
      )
        .bind(upstreamId)
        .run();
      return count;
    }
    const raw = decodeBase64Utf8(b64);
    nodes = await parseSubscription(raw);
  } else {
    const res = await fetch(upstream.subscription_url, {
      headers: { "user-agent": "dns-sub-share/0.1" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) throw new Error(`上游 HTTP 错误: ${res.status}`);
    const text = await res.text();
    if (text.length > 5_000_000) throw new Error("上游订阅内容过大（超过 5MB）");
    nodes = await parseSubscription(text);
  }

  if (!nodes.length) throw new Error("上游未解析出有效节点");

  const prevCountRow = await env.DB.prepare(
    "SELECT COUNT(*) AS count FROM nodes WHERE upstream_id=? AND active=1"
  )
    .bind(upstreamId)
    .first<{ count: number }>();
  const prevCount = Number(prevCountRow?.count ?? 0);
  const minPrev = Math.max(1, Number(env.UPSTREAM_ANTI_WIPE_MIN_PREV ?? 5));
  const ratio = Math.max(0.05, Math.min(0.9, Number(env.UPSTREAM_ANTI_WIPE_RATIO ?? 0.2)));

  if (prevCount >= minPrev && nodes.length < Math.ceil(prevCount * ratio)) {
    const alertMsg = `上游节点骤降保护触发：原 ${prevCount} 个活跃节点，本次仅解析出 ${nodes.length} 个，已拒绝覆盖`;
    await env.DB.prepare("UPDATE upstreams SET last_error=? WHERE id=?")
      .bind(alertMsg, upstreamId)
      .run();
    console.warn(JSON.stringify({ event: "upstream_anti_wipe_triggered", upstreamId, prevCount, newCount: nodes.length }));
    await sendAlert(env, { event: "upstream_anti_wipe_triggered", upstreamId, prevCount, newCount: nodes.length });
    throw new Error(alertMsg);
  }

  const statements: D1PreparedStatement[] = [
    env.DB.prepare("UPDATE nodes SET active=0 WHERE upstream_id=?").bind(upstreamId),
  ];

  for (const node of nodes) {
    const localized = localizedNodeName(node.name, upstreamId);
    statements.push(
      env.DB.prepare(
        `INSERT INTO nodes(upstream_id, fingerprint, name, protocol, original_server, original_uri, active, updated_at)
         VALUES(?,?,?,?,?,?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(upstream_id, fingerprint) DO UPDATE SET
           name=excluded.name,
           protocol=excluded.protocol,
           original_server=excluded.original_server,
           original_uri=excluded.original_uri,
           active=1,
           updated_at=CURRENT_TIMESTAMP`
      ).bind(upstreamId, node.fingerprint, localized, node.protocol, node.server, node.originalUri)
    );
  }

  statements.push(
    env.DB.prepare("UPDATE upstreams SET last_synced_at=CURRENT_TIMESTAMP, last_error=NULL WHERE id=?").bind(upstreamId)
  );

  await env.DB.batch(statements);
  return nodes.length;
}

export async function reconcileUpstream(env: Env, upstreamId: number, budget: Budget): Promise<void> {
  const concurrency = Math.max(1, Math.min(5, Number(env.DNS_CONCURRENCY || 4)));
  const stale = await env.DB.prepare(
    `SELECT d.id, d.cloudflare_record_id, d.zone_id FROM user_dns_records d
     JOIN nodes n ON n.id=d.node_id
     WHERE n.upstream_id=? AND n.active=0 AND d.status='active'`
  )
    .bind(upstreamId)
    .all<{ id: number; cloudflare_record_id: string | null; zone_id: string | null }>();

  await runWithConcurrency(stale.results || [], concurrency, async (row) => {
    if (budget.count >= budget.limit || budget.rateLimited) return;
    try {
      await deleteDns(env, row.zone_id || env.CF_ZONE_ID, row.cloudflare_record_id ?? "", budget);
      await env.DB.prepare(
        "UPDATE user_dns_records SET status='deleted', cloudflare_record_id=NULL, last_error=NULL WHERE id=?"
      )
        .bind(row.id)
        .run();
    } catch (error) {
      if (!isBudgetAbort(budget, error)) {
        await env.DB.prepare(
          "UPDATE user_dns_records SET status='error', last_error=? WHERE id=?"
        )
          .bind(error instanceof Error ? error.message : String(error), row.id)
          .run();
      }
    }
  });

  try {
    await env.DB.batch([
      env.DB.prepare(
        `INSERT OR IGNORE INTO user_selected_nodes(user_id, node_id)
         SELECT s.user_id, n_new.id
         FROM user_selected_nodes s
         JOIN nodes n_old ON n_old.id = s.node_id
         JOIN nodes n_new ON n_new.upstream_id = n_old.upstream_id AND n_new.name = n_old.name AND n_new.active = 1
         WHERE n_old.upstream_id = ? AND n_old.active = 0`
      ).bind(upstreamId),
      env.DB.prepare(
        "DELETE FROM user_selected_nodes WHERE node_id IN (SELECT id FROM nodes WHERE upstream_id = ? AND active = 0)"
      ).bind(upstreamId),
      env.DB.prepare(
        `INSERT OR IGNORE INTO plan_selected_nodes(plan_id, node_id)
         SELECT p.plan_id, n_new.id
         FROM plan_selected_nodes p
         JOIN nodes n_old ON n_old.id = p.node_id
         JOIN nodes n_new ON n_new.upstream_id = n_old.upstream_id AND n_new.name = n_old.name AND n_new.active = 1
         WHERE n_old.upstream_id = ? AND n_old.active = 0`
      ).bind(upstreamId),
      env.DB.prepare(
        "DELETE FROM plan_selected_nodes WHERE node_id IN (SELECT id FROM nodes WHERE upstream_id = ? AND active = 0)"
      ).bind(upstreamId),
    ]);
  } catch (err) {
    console.error(JSON.stringify({ event: "reconcile_migration_error", upstreamId, error: err instanceof Error ? err.message : String(err) }));
  }

  const users = await env.DB.prepare(
    `SELECT DISTINCT u.id, u.name, u.upstream_id, u.expires_at, u.status, u.node_limit, u.plan_id, u.dns_revision
     FROM users u
     WHERE u.status = 'active' AND julianday(u.expires_at) > julianday('now') AND (
       u.upstream_id = ?
       OR EXISTS (
         SELECT 1 FROM user_selected_nodes s JOIN nodes n ON n.id = s.node_id
         WHERE s.user_id = u.id AND n.upstream_id = ?
       )
       OR EXISTS (
         SELECT 1 FROM plan_selected_nodes p JOIN nodes n ON n.id = p.node_id
         WHERE n.upstream_id = ? AND (
           p.plan_id = COALESCE(u.plan_id, 'trial_1d')
           OR (u.plan_id IN ('standard_monthly', 'standard_quarterly', 'standard_yearly') AND p.plan_id = 'advanced_monthly')
         )
       )
     )`
  )
    .bind(upstreamId, upstreamId, upstreamId)
    .all<UserRow>();

  for (const user of users.results || []) {
    if (budget.count >= budget.limit || budget.rateLimited) break;
    await provisionUser(env, user, { prune: true, budget });
  }
}

export async function syncAllUpstreams(env: Env): Promise<Record<string, number>> {
  const upstreams = await env.DB.prepare("SELECT id FROM upstreams WHERE enabled=1 ORDER BY id ASC")
    .all<{ id: number }>();
  const results: Record<string, number> = {};
  const budget = createBudget(env, 250);

  for (const row of upstreams.results || []) {
    try {
      const count = await syncUpstream(env, row.id);
      results[String(row.id)] = count;
      await reconcileUpstream(env, row.id, budget);
    } catch (error) {
      console.error(JSON.stringify({ event: "sync_upstream_error", upstreamId: row.id, error: error instanceof Error ? error.message : String(error) }));
      await env.DB.prepare("UPDATE upstreams SET last_error=? WHERE id=?")
        .bind(error instanceof Error ? error.message : String(error), row.id)
        .run();
    }
  }
  return results;
}

export async function healAndMaintain(env: Env): Promise<{ healed: number; budgetUsed: number }> {
  const budget = createBudget(env, 200);
  try {
    const twoDaysAgoSec = Math.floor(Date.now() / 1000) - 172800;
    await env.DB.prepare("DELETE FROM app_rate_limits WHERE window_start < ?").bind(twoDaysAgoSec).run();
    await env.DB.prepare("DELETE FROM app_email_codes WHERE julianday(created_at) < julianday('now', '-7 day')").run();
    await env.DB.prepare("DELETE FROM app_sessions WHERE julianday(expires_at) < julianday('now', '-30 day')").run();
  } catch (err) {
    console.error(JSON.stringify({ event: "cleanup_stale_data_error", error: err instanceof Error ? err.message : String(err) }));
  }

  let healed = 0;
  try {
    const candidates = await env.DB.prepare(
      `SELECT u.id, u.name, u.upstream_id, u.expires_at, u.status, u.node_limit, u.plan_id, u.dns_revision
       FROM users u
       LEFT JOIN user_dns_records d ON d.user_id = u.id AND d.status = 'active'
       WHERE u.status = 'active' AND julianday(u.expires_at) > julianday('now')
       GROUP BY u.id
       HAVING COUNT(d.id) < u.node_limit OR EXISTS (
         SELECT 1 FROM user_dns_records e WHERE e.user_id = u.id AND e.status = 'error'
       )
       ORDER BY COUNT(d.id) ASC, RANDOM()
       LIMIT 20`
    ).all<UserRow>();

    for (const u of candidates.results || []) {
      if (budget.count >= budget.limit || budget.rateLimited) break;
      try {
        await provisionUser(env, u, { prune: true, budget });
        healed++;
      } catch (err) {
        console.error(JSON.stringify({ event: "heal_user_error", userId: u.id, error: err instanceof Error ? err.message : String(err) }));
      }
    }

    const pools = dnsPools(env);
    const stats = await loadDnsPoolStats(env);
    let totalActive = 0;
    let totalCapacity = 0;
    const poolSummary = pools.map((p) => {
      const active = stats.activeCounts.get(p.zoneId) || 0;
      const errors = stats.errorCounts.get(p.zoneId) || 0;
      totalActive += active;
      totalCapacity += p.maxRecords;
      return { suffix: p.suffix, zoneId: p.zoneId, active, errors, maxRecords: p.maxRecords };
    });

    const usageRatio = totalCapacity > 0 ? totalActive / totalCapacity : 1;
    if (usageRatio >= 0.85 || poolSummary.some((p) => p.errors >= 5)) {
      console.warn(JSON.stringify({ event: "dns_pool_alert", usageRatio: Number(usageRatio.toFixed(3)), pools: poolSummary }));
      await sendAlert(env, { event: "dns_pool_alert", usageRatio: Number(usageRatio.toFixed(3)), pools: poolSummary });
    }

    console.log(JSON.stringify({ event: "heal_complete", healed, budgetUsed: budget.count }));
    return { healed, budgetUsed: budget.count };
  } catch (err) {
    console.error(JSON.stringify({ event: "heal_maintain_error", error: err instanceof Error ? err.message : String(err) }));
    return { healed, budgetUsed: budget.count };
  }
}

export async function expireUsers(env: Env): Promise<{ expired: number; budgetUsed: number }> {
  const budget = createBudget(env, 200);
  const users = await env.DB.prepare(
    `SELECT id, name, upstream_id, expires_at, status, node_limit, plan_id, dns_revision
     FROM users WHERE status='active' AND julianday(expires_at) <= julianday('now')
     ORDER BY expires_at ASC`
  ).all<UserRow>();

  let expired = 0;
  for (const user of users.results || []) {
    if (budget.count >= budget.limit || budget.rateLimited) break;
    const res = await deprovisionUser(env, user.id, budget);
    if (res.aborted) {
      break;
    }
    if (res.failed === 0) {
      await env.DB.prepare("UPDATE users SET status='expired' WHERE id=?").bind(user.id).run();
      expired++;
    } else {
      console.error(JSON.stringify({ event: "expire_user_partial_error", userId: user.id, failedCount: res.failed }));
    }
  }
  return { expired, budgetUsed: budget.count };
}

export async function purgeExpiredTrialUsers(
  env: Env,
  { limit = 50, budget = null }: { limit?: number; budget?: Budget | null } = {}
): Promise<{ purged: number; dnsDeleted: number }> {
  const effectiveBudget = budget || createBudget(env, 200);
  const candidates = await env.DB.prepare(`
    SELECT u.id, u.name, u.expires_at
    FROM users u
    WHERE julianday(u.expires_at) < julianday('now', '-30 day')
      AND NOT EXISTS (
        SELECT 1 FROM app_user_profiles p
        WHERE p.user_id = u.id AND p.email IS NOT NULL AND TRIM(p.email) != ''
      )
      AND NOT EXISTS (
        SELECT 1 FROM app_orders o
        WHERE o.user_id = u.id AND o.status = 'paid'
      )
    ORDER BY u.expires_at ASC
    LIMIT ?
  `)
    .bind(limit)
    .all<{ id: number; name: string; expires_at: string }>();

  const userList = candidates.results || [];
  if (!userList.length) {
    return { purged: 0, dnsDeleted: 0 };
  }

  let purged = 0;
  let dnsDeleted = 0;

  for (const user of userList) {
    if (effectiveBudget.count >= effectiveBudget.limit || effectiveBudget.rateLimited) break;

    const dnsRecords = await env.DB.prepare(
      "SELECT cloudflare_record_id, zone_id FROM user_dns_records WHERE user_id = ? AND cloudflare_record_id IS NOT NULL"
    )
      .bind(user.id)
      .all<{ cloudflare_record_id: string; zone_id: string | null }>();

    let dnsAborted = false;
    for (const rec of dnsRecords.results || []) {
      if (effectiveBudget.count >= effectiveBudget.limit || effectiveBudget.rateLimited) {
        dnsAborted = true;
        break;
      }
      if (rec.cloudflare_record_id) {
        try {
          await deleteDns(env, rec.zone_id || env.CF_ZONE_ID, rec.cloudflare_record_id, effectiveBudget);
          dnsDeleted++;
        } catch (err) {
          if (isBudgetAbort(effectiveBudget, err)) {
            dnsAborted = true;
            break;
          }
          console.warn(JSON.stringify({ event: "purge_dns_error", userId: user.id, error: err instanceof Error ? err.message : String(err) }));
        }
      }
    }

    if (dnsAborted) {
      break;
    }

    try {
      await env.DB.batch([
        env.DB.prepare("DELETE FROM user_dns_records WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM user_selected_nodes WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM subscription_access_daily WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM app_sessions WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM app_devices WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM app_email_codes WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM app_user_profiles WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM app_order_grants WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM app_orders WHERE user_id = ?").bind(user.id),
        env.DB.prepare("DELETE FROM users WHERE id = ?").bind(user.id),
      ]);
      purged++;
      console.log(JSON.stringify({ event: "user_purged", userId: user.id, name: user.name, expiresAt: user.expires_at }));
    } catch (err) {
      console.error(JSON.stringify({ event: "purge_user_db_error", userId: user.id, error: err instanceof Error ? err.message : String(err) }));
    }
  }

  return { purged, dnsDeleted };
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

export async function handleFetch(request: Request, env: Env, _ctx?: ExecutionContext): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "GET" && url.pathname === "/health") {
    return jsonResponse({
      ok: true,
      worker: "dns-sub-share-cron",
      timestamp: new Date().toISOString(),
    });
  }

  if (request.method === "POST" && url.pathname === "/run") {
    if (!env.CRON_TRIGGER_SECRET || !env.CRON_TRIGGER_SECRET.trim()) {
      return jsonResponse({ error: "not_found" }, 404);
    }

    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim() || request.headers.get("x-cron-secret") || "";
    if (!token || !(await secureEqual(token, env.CRON_TRIGGER_SECRET.trim()))) {
      return jsonResponse({ error: "unauthorized" }, 401);
    }

    const job = url.searchParams.get("job");
    if (job !== "expire" && job !== "heal" && job !== "sync" && job !== "purge") {
      return jsonResponse({ error: "invalid_job" }, 400);
    }

    const startedAt = Date.now();
    let result: unknown;
    if (job === "heal") {
      result = await healAndMaintain(env);
    } else if (job === "sync") {
      result = await syncAllUpstreams(env);
    } else if (job === "expire") {
      result = await expireUsers(env);
    } else if (job === "purge") {
      result = await purgeExpiredTrialUsers(env, { limit: 100 });
    }

    return jsonResponse({
      ok: true,
      job,
      durationMs: Date.now() - startedAt,
      result,
    });
  }

  return jsonResponse({ error: "not_found" }, 404);
}

export async function handleScheduled(
  controller: Pick<ScheduledController, "cron" | "scheduledTime">,
  env: Env
): Promise<Record<string, unknown>> {
  const startedAt = Date.now();
  const cron = controller.cron;
  console.log(JSON.stringify({ event: "cron_start", cron }));

  try {
    if (cron === "*/15 * * * *") {
      const result = await healAndMaintain(env);
      const summary = { event: "cron_complete", cron, durationMs: Date.now() - startedAt, result };
      console.log(JSON.stringify(summary));
      return summary;
    }

    if (cron === "7 * * * *") {
      const result = await syncAllUpstreams(env);
      const summary = { event: "cron_complete", cron, durationMs: Date.now() - startedAt, result };
      console.log(JSON.stringify(summary));
      return summary;
    }

    // 默认路径：*/5 * * * *
    const now = new Date(controller.scheduledTime || Date.now());
    let retentionDeleted: number | null = null;
    let purgeResult: { purged: number; dnsDeleted: number } | null = null;
    if (now.getUTCHours() === 19 && now.getUTCMinutes() < 5) {
      const ret = await env.DB.prepare(
        "DELETE FROM subscription_access_daily WHERE access_date < date('now', '-30 day')"
      ).run();
      retentionDeleted = Number(ret.meta?.changes ?? 0);
      console.log(JSON.stringify({ event: "access_log_retention_complete", deleted: retentionDeleted }));

      purgeResult = await purgeExpiredTrialUsers(env);
      console.log(JSON.stringify({ event: "purge_expired_users_complete", ...purgeResult }));
    }

    const expireResult = await expireUsers(env);
    console.log(JSON.stringify({ event: "expiry_complete", ...expireResult }));
    const summary = {
      event: "cron_complete",
      cron,
      durationMs: Date.now() - startedAt,
      result: { retentionDeleted, purgeResult, expireResult },
    };
    console.log(JSON.stringify(summary));
    return summary;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(JSON.stringify({ event: "cron_error", cron, durationMs: Date.now() - startedAt, error: message }));
    await sendAlert(env, { event: "cron_error", cron, error: message });
    throw err;
  }
}

const cronWorker = {
  fetch: handleFetch,
  async scheduled(controller: ScheduledController, env: Env, _ctx: ExecutionContext): Promise<void> {
    await handleScheduled(controller, env);
  },
};

export default cronWorker;
