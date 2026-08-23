import { describe, it, expect } from "vitest";
import { endpoints, type Endpoint } from "./endpoints";

function flatten(obj: Record<string, unknown>): Endpoint[] {
	const out: Endpoint[] = [];
	for (const value of Object.values(obj)) {
		const group = value as Record<string, Endpoint>;
		for (const ep of Object.values(group)) out.push(ep);
	}
	return out;
}

const all = flatten(endpoints as unknown as Record<string, unknown>);
const VALID = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

describe("endpoints registry", () => {
	it("every entry has a valid method and a leading-slash path", () => {
		for (const ep of all) {
			expect(VALID.has(ep.method)).toBe(true);
			expect(ep.path.startsWith("/")).toBe(true);
		}
	});

	it("pins a few well-known routes", () => {
		expect(endpoints.auth.login).toEqual({ method: "GET", path: "/login" });
		expect(endpoints.university.list).toEqual({
			method: "GET",
			path: "/university/user/get",
		});
		expect(endpoints.application.create).toEqual({
			method: "POST",
			path: "/applications/create",
		});
	});

	it("covers a meaningful number of operations", () => {
		expect(all.length).toBeGreaterThanOrEqual(30);
	});
});
