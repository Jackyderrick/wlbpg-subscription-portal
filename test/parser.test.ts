import { describe, expect, it } from "vitest";
import { encodeSubscription, parseSubscription, rewriteNode } from "../src/parser";

describe("subscription parser", () => {
  it("rewrites only the VLESS connection hostname", async () => {
    const uri = "vless://user-id@jp.airport.test:443?security=tls&sni=origin.airport.test#JP";
    const [node] = await parseSubscription(uri);
    expect(node.server).toBe("jp.airport.test");
    const rewritten = rewriteNode(node.originalUri, node.protocol, "u1-jp.node.example.com");
    const url = new URL(rewritten);
    expect(url.hostname).toBe("u1-jp.node.example.com");
    expect(url.searchParams.get("sni")).toBe("origin.airport.test");
    expect(url.username).toBe("user-id");
  });

  it("parses and rewrites VMess JSON", async () => {
    const config = { v: "2", ps: "HK", add: "hk.airport.test", port: "443", id: "uuid", tls: "tls", sni: "hk.airport.test" };
    const uri = "vmess://" + btoa(JSON.stringify(config));
    const [node] = await parseSubscription(encodeSubscription([uri]));
    expect(node.name).toBe("HK");
    const rewritten = rewriteNode(node.originalUri, node.protocol, "u2-hk.node.example.com");
    const decoded = JSON.parse(atob(rewritten.slice(8)));
    expect(decoded.add).toBe("u2-hk.node.example.com");
    expect(decoded.sni).toBe("hk.airport.test");
  });
});
