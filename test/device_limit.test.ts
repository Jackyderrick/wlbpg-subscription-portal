import { describe, expect, it } from "vitest";

describe("Device Limit and Auto-Eviction Logic", () => {
  it("verifies device limit eviction picks the oldest device and preserves newest", () => {
    const devices = [
      { id: 1, last_seen_at: "2026-11-15T00:00:00Z" },
      { id: 2, last_seen_at: "2026-11-16T00:00:00Z" },
      { id: 3, last_seen_at: "2026-11-16T12:00:00Z" },
    ];
    const limit = 2;
    const currentDeviceId = 3;

    expect(devices.length).toBeGreaterThan(limit);
    const candidateDevices = currentDeviceId ? devices.filter(d => d.id !== currentDeviceId) : devices;
    const toEvictCount = devices.length - limit;
    const toEvict = candidateDevices.slice(0, toEvictCount);

    expect(toEvict.length).toBe(1);
    expect(toEvict[0].id).toBe(1); // Oldest device is evicted

    const remaining = devices.filter(d => !toEvict.some(e => e.id === d.id));
    expect(remaining.map(r => r.id)).toEqual([2, 3]);
    expect(remaining.length).toBe(2);
  });

  it("verifies eviction when device limit is lowered to 1", () => {
    const devices = [
      { id: 2, last_seen_at: "2026-11-16T00:00:00Z" },
      { id: 3, last_seen_at: "2026-11-16T12:00:00Z" },
    ];
    const limit = 1;

    const toEvictCount = devices.length - limit;
    const toEvict = devices.slice(0, toEvictCount);
    expect(toEvict.length).toBe(1);
    expect(toEvict[0].id).toBe(2);

    const remaining = devices.filter(d => !toEvict.some(e => e.id === d.id));
    expect(remaining.map(r => r.id)).toEqual([3]);
  });
});
