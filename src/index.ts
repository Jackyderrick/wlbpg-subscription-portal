import { connectionIdentity, dnsType, encodeSubscription, parseSubscription, rewriteNode } from "./parser";

type Env = {
  DB: D1Database;
  DNS_SUFFIX: string;
  CF_ZONE_ID: string;
  DNS_POOLS?: string;
  CF_API_TOKEN: string;
  ADMIN_SECRET: string;
  ACCESS_LOG_SALT?: string;
};

type DbUser = { id: number; name: string; upstream_id: number; expires_at: string; status: string; node_limit: number; dns_revision: number };
type DbNode = { id: number; fingerprint: string; name: string; protocol: string; original_server: string; original_uri: string };
type PoolNode = DbNode & { source_name: string; upstream_id: number };
type DnsRow = { id: number; hostname: string; cloudflare_record_id: string | null; zone_id: string | null };
type SubscriptionUser = { id: number; status: string; expires_at: string };
type DnsPool = { suffix: string; zoneId: string; maxRecords: number };

const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const encoder = new TextEncoder();

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
