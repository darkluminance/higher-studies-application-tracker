import { describe, it, expect } from "vitest";
import { isYes } from "./index";

describe("isYes", () => {
	it("treats boolean true and 'YES'-like strings as true", () => {
		expect(isYes(true)).toBe(true);
		expect(isYes("YES")).toBe(true);
		expect(isYes("yes")).toBe(true);
		expect(isYes("true")).toBe(true);
	});

	it("treats everything else as false", () => {
		expect(isYes(false)).toBe(false);
		expect(isYes("NO")).toBe(false);
		expect(isYes("")).toBe(false);
		expect(isYes(undefined)).toBe(false);
		expect(isYes(null)).toBe(false);
		expect(isYes("anything")).toBe(false);
	});
});
