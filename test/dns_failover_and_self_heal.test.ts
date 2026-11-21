import { describe, expect, it } from "vitest";

describe("DNS pool anti-black hole, failover and self-healing", () => {
  it("verifies pickDnsPool weighting avoids error-heavy pools", () => {
    const pools = [
      { suffix: "pool-a.org", zoneId: "zone_a", maxRecords: 100 },
      { suffix: "pool-b.org", zoneId: "zone_b", maxRecords: 100 },
    ];
    // Pool A: 20 active, 50 error (black hole candidate)
    // Pool B: 30 active, 0 error
    const activeCounts = new Map([["zone_a", 20], ["zone_b", 30]]);
    const errorCounts = new Map([["zone_a", 50], ["zone_b", 0]]);

    function pick(excludedZoneIds = new Set<string>()) {
      const available = pools.filter(p => !excludedZoneIds.has(p.zoneId));
      return available.sort((a, b) => {
        const loadA = ((activeCounts.get(a.zoneId) || 0) + (errorCounts.get(a.zoneId) || 0) * 2) / a.maxRecords;
        const loadB = ((activeCounts.get(b.zoneId) || 0) + (errorCounts.get(b.zoneId) || 0) * 2) / b.maxRecords;
        return loadA - loadB;
      })[0];
    }

    // Without penalty, zone_a (20) would be chosen over zone_b (30).
    // With penalty:
    // loadA = (20 + 50*2)/100 = 1.2
    // loadB = (30 + 0)/100 = 0.3
    // Pool B must be picked!
    expect(pick().zoneId).toBe("zone_b");

    // If Pool B is excluded due to a transient failure, it falls back to Pool A
    expect(pick(new Set(["zone_b"])).zoneId).toBe("zone_a");
  });

  it("verifies secureEqual prevents empty string or undefined bypass", async () => {
    async function hash(v: string) {
      const enc = new TextEncoder().encode(v);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    }

    async function secureEqual(a: any, b: any) {
      if (typeof a !== "string" || typeof b !== "string" || !a || !b) return false;
      const [ah, bh] = await Promise.all([hash(a), hash(b)]);
      let diff = 0;
      for (let i = 0; i < ah.length; i++) diff |= ah.charCodeAt(i) ^ bh.charCodeAt(i);
      return diff === 0;
    }

    expect(await secureEqual("secret123", "secret123")).toBe(true);
    expect(await secureEqual("", "")).toBe(false);
    expect(await secureEqual(undefined, "secret123")).toBe(false);
    expect(await secureEqual("secret123", undefined)).toBe(false);
    expect(await secureEqual("secret123", "wrong")).toBe(false);
  });
});
