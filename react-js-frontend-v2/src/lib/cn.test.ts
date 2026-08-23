import { describe, it, expect } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
	it("joins truthy class names", () => {
		expect(cn("a", "b")).toBe("a b");
	});

	it("ignores falsy values", () => {
		expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
	});

	it("supports conditional object syntax", () => {
		expect(cn("base", { active: true, hidden: false })).toBe("base active");
	});

	it("merges conflicting tailwind classes, last wins", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
		expect(cn("text-ink", "text-clay")).toBe("text-clay");
	});
});
