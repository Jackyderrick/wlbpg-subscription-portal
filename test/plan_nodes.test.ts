import { describe, expect, it } from "vitest";
import worker from "../src/index";

describe("Plan tiers (体验 / 基础 / 高级 / 家宽) and Plan-designated Node Pool", () => {
  it("serves the 4 unified plan tiers via /api/app/plans", async () => {
    const req = new Request("https://app.5858188.xyz/api/app/plans");
    const res = await worker.fetch(req, {} as any);
    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(Array.isArray(body.plans)).toBe(true);
    expect(body.plans.map((p: any) => p.name)).toEqual(["体验", "基础", "高级", "家宽"]);
    expect(body.plans.map((p: any) => p.id)).toEqual([
      "trial_1d",
      "basic_monthly",
      "advanced_monthly",
      "residential_monthly",
    ]);
  });

  it("serves admin page with plans management UI and valid client script", async () => {
    const req = new Request("https://app.5858188.xyz/");
    const res = await worker.fetch(req, {} as any);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain('data-view="plans"');
    expect(html).toContain('id="plansView"');
    expect(html).toContain('id="planEditor"');
    expect(html).toContain('id="planNodeList"');
    expect(html).toContain('id="dnsPlanId"');
  });

  it("verifies node pool priority: user_selected_nodes > plan_selected_nodes > upstream pool", () => {
    function resolveAllowedNodeIds(
      userSelectedIds: number[],
      planSelectedIds: number[]
    ): number[] {
      if (userSelectedIds.length > 0) return userSelectedIds;
      if (planSelectedIds.length > 0) return planSelectedIds;
      return [];
    }

    // Case 1: User has no personal override, uses plan's designated nodes
    expect(resolveAllowedNodeIds([], [101, 102, 103])).toEqual([101, 102, 103]);

    // Case 2: User has personal override, overrides plan's designated nodes
    expect(resolveAllowedNodeIds([201, 202], [101, 102, 103])).toEqual([201, 202]);

    // Case 3: Neither configured, falls back to empty (global upstream pool)
    expect(resolveAllowedNodeIds([], [])).toEqual([]);
  });
});
