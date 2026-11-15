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

  it("parses multiline direct node links (vless, trojan, vmess)", async () => {
    const vless = "vless://u1@us-res-01.isp.net:443?security=tls#%E7%BE%8E%E5%9B%BD%E5%AE%B6%E5%AE%BD-01";
    const trojan = "trojan://pass@hk-direct.isp.net:443#%E9%A6%99%E6%B8%AF%E4%B8%93%E7%BA%BF-02";
    const rawInput = `${vless}\n\n${trojan}\n`;
    const nodes = await parseSubscription(rawInput);
    expect(nodes.length).toBe(2);
    expect(nodes[0].name).toBe("美国家宽-01");
    expect(nodes[0].protocol).toBe("vless");
    expect(nodes[0].server).toBe("us-res-01.isp.net");
    expect(nodes[1].name).toBe("香港专线-02");
    expect(nodes[1].protocol).toBe("trojan");
    expect(nodes[1].server).toBe("hk-direct.isp.net");
  });

  it("parses base64-encoded raw node text", async () => {
    const vless = "vless://u1@us-res-02.isp.net:443?security=tls#US-Residential";
    const encoded = btoa(vless);
    const nodes = await parseSubscription(encoded);
    expect(nodes.length).toBe(1);
    expect(nodes[0].server).toBe("us-res-02.isp.net");
    expect(nodes[0].name).toBe("US-Residential");
  });
});
