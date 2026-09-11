export type ParsedNode = {
  fingerprint: string;
  name: string;
  protocol: "vless" | "vmess" | "trojan" | "ss";
  server: string;
  originalUri: string;
};

const encoder = new TextEncoder();

function b64decode(value: string): string {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return decodeURIComponent(Array.from(atob(padded), c => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`).join(""));
}

function b64encode(value: string): string {
  const bytes = encoder.encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}

function subscriptionText(input: string): string {
  const trimmed = input.trim();
  if (/^(vless|vmess|trojan|ss):\/\//m.test(trimmed)) return trimmed;
  try {
    const decoded = b64decode(trimmed);
    return /^(vless|vmess|trojan|ss):\/\//m.test(decoded) ? decoded : trimmed;
  } catch {
    return trimmed;
  }
}

function displayName(uri: string, fallback: string): string {
  const fragment = uri.split("#", 2)[1];
  if (!fragment) return fallback;
  try { return decodeURIComponent(fragment); } catch { return fragment; }
}

export async function parseSubscription(input: string): Promise<ParsedNode[]> {
  const lines = subscriptionText(input).split(/\r?\n/).map(x => x.trim()).filter(Boolean);
  const result: ParsedNode[] = [];
  for (const originalUri of lines) {
    try {
      if (originalUri.startsWith("vmess://")) {
        const json = JSON.parse(b64decode(originalUri.slice(8))) as Record<string, unknown>;
        const server = String(json.add ?? "");
        if (!server) continue;
        const stable = `vmess|${server}|${String(json.port ?? "")}|${String(json.id ?? "")}`;
        result.push({ fingerprint: (await sha256(stable)).slice(0, 24), name: String(json.ps ?? server), protocol: "vmess", server, originalUri });
        continue;
      }
      const protocol = originalUri.split(":", 1)[0] as ParsedNode["protocol"];
      if (!(["vless", "trojan", "ss"] as string[]).includes(protocol)) continue;
      const url = new URL(originalUri);
      const server = url.hostname;
      if (!server) continue;
      const stable = `${protocol}|${server}|${url.port}|${url.username}`;
      result.push({ fingerprint: (await sha256(stable)).slice(0, 24), name: displayName(originalUri, server), protocol, server, originalUri });
    } catch {
      // Ignore malformed lines while preserving valid nodes in the same subscription.
    }
  }
  return result;
}

/**
 * A display name is not part of a node's connection identity.  This lets the
 * merged node pool hide an exact duplicate that was published by two upstream
 * subscriptions under different names, while keeping genuinely different
 * connection settings available.
 */
export function connectionIdentity(originalUri: string, protocol: string): string {
  if (protocol === "vmess") {
    const json = JSON.parse(b64decode(originalUri.slice(8))) as Record<string, unknown>;
    delete json.ps;
    const normalized = Object.fromEntries(Object.entries(json).sort(([left], [right]) => left.localeCompare(right)));
    return `vmess|${JSON.stringify(normalized)}`;
  }
  const url = new URL(originalUri);
  url.hash = "";
  return `${protocol}|${url.toString()}`;
}

export function rewriteNode(originalUri: string, protocol: string, hostname: string, name?: string): string {
  if (protocol === "vmess") {
    const json = JSON.parse(b64decode(originalUri.slice(8))) as Record<string, unknown>;
    json.add = hostname;
    if (name) json.ps = name;
    return `vmess://${b64encode(JSON.stringify(json))}`;
  }
  const url = new URL(originalUri);
  url.hostname = hostname;
  if (name) url.hash = name;
  return url.toString();
}

export function encodeSubscription(lines: string[]): string {
  return b64encode(lines.join("\n"));
}

export function dnsType(server: string): "A" | "AAAA" | "CNAME" {
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(server)) return "A";
  if (server.includes(":")) return "AAAA";
  return "CNAME";
}
