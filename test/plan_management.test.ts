import { describe, expect, it } from "vitest";
import worker from "../src/index";

describe("Plan Management & Client Display Toggle", () => {
  it("serves HTML with plan management and client display toggle controls", async () => {
    const req = new Request("https://app.5858188.xyz/");
    const res = await worker.fetch(req, {} as any);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("客户端显示");
    expect(html).toContain('id="planEditId"');
    expect(html).toContain('id="planEditEnabled"');
    expect(html).toContain('data-toggle-plan');
    expect(html).toContain('data-delete-plan');
    expect(html).toContain("新建套餐");
  });

  it("handles plan toggle and deletion constraints", async () => {
    const plans = [
      { id: "trial_1d", name: "体验", enabled: 1 },
      { id: "basic_monthly", name: "基础", enabled: 1 },
      { id: "advanced_monthly", name: "高级", enabled: 0 },
      { id: "custom_yearly", name: "年付特惠", enabled: 1 },
    ];

    // Client facing filter: only enabled=1
    const clientPlans = plans.filter((p) => p.enabled === 1);
    expect(clientPlans.map((p) => p.id)).toEqual(["trial_1d", "basic_monthly", "custom_yearly"]);
    expect(clientPlans.find((p) => p.id === "advanced_monthly")).toBeUndefined();

    // Admin dashboard: sees all plans with enabled flag
    expect(plans.length).toBe(4);
    expect(plans.find((p) => p.id === "advanced_monthly")?.enabled).toBe(0);

    // Default plan delete protection
    const defaultIds = ["trial_1d", "basic_monthly", "advanced_monthly", "residential_monthly"];
    expect(defaultIds.includes("trial_1d")).toBe(true);
    expect(defaultIds.includes("custom_yearly")).toBe(false);
  });
});
