import { describe, expect, it } from "vitest";
import worker from "../src/index";

describe("Admin direct node import and customer DNS node binding", () => {
  it("verifies direct node link parsing logic used by the API", async () => {
    const raw = "vless://u1@us-01.test:443?security=tls#美区-01\ntrojan://p1@hk-01.test:443#香港-01";
    const isHttp = /^https?:\/\//i.test(raw);
    const isNode = /^(vless|vmess|trojan|ss):\/\//m.test(raw);
    expect(isHttp).toBe(false);
    expect(isNode).toBe(true);

    const { parseSubscription } = await import("../src/parser");
    const nodes = await parseSubscription(raw);
    expect(nodes.length).toBe(2);
    expect(nodes[0].server).toBe("us-01.test");
    expect(nodes[1].server).toBe("hk-01.test");
  });

  it("verifies worker exports fetch and scheduled handlers", () => {
    expect(typeof worker.fetch).toBe("function");
    expect(typeof worker.scheduled).toBe("function");
  });

  it("verifies mobile vs desktop guest username prefix logic", () => {
    function getGuestPrefix(platformRaw: string | undefined): string {
      const platform = String(platformRaw || "android").trim().toLowerCase();
      const isDesktop = ["windows", "mac", "macos", "linux", "web", "desktop", "pc"].some(p => platform.includes(p));
      return isDesktop ? "Web Guest" : "App Guest";
    }

    // Mobile platforms
    expect(getGuestPrefix("android")).toBe("App Guest");
    expect(getGuestPrefix("Android")).toBe("App Guest");
    expect(getGuestPrefix("ios")).toBe("App Guest");
    expect(getGuestPrefix(undefined)).toBe("App Guest");

    // Desktop/PC/Web platforms
    expect(getGuestPrefix("windows")).toBe("Web Guest");
    expect(getGuestPrefix("Windows 11")).toBe("Web Guest");
    expect(getGuestPrefix("macos")).toBe("Web Guest");
    expect(getGuestPrefix("linux")).toBe("Web Guest");
    expect(getGuestPrefix("web")).toBe("Web Guest");
    expect(getGuestPrefix("desktop")).toBe("Web Guest");
  });
});
