import { describe, it, expect } from "vitest";
import { navGroups, allNavItems } from "./navigation";

describe("navigation config", () => {
	it("has the four labelled groups in order", () => {
		expect(navGroups.map((g) => g.label)).toEqual([
			"Overview",
			"Schools",
			"People",
			"Outreach",
		]);
	});

	it("flattens to seven nav items, each fully specified", () => {
		expect(allNavItems).toHaveLength(7);
		for (const item of allNavItems) {
			expect(item.to.startsWith("/")).toBe(true);
			expect(item.label.length).toBeGreaterThan(0);
			expect(item.icon).toBeTruthy();
			expect(["overview", "schools", "people", "outreach"]).toContain(item.cluster);
		}
	});

	it("routes the key destinations", () => {
		const paths = allNavItems.map((i) => i.to);
		expect(paths).toEqual(
			expect.arrayContaining([
				"/",
				"/university",
				"/application",
				"/faculty",
				"/recommender",
				"/mail",
				"/interview",
			])
		);
	});
});
