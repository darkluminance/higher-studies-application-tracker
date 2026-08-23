import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Logo, LogoTile, LogoMark } from "./Logo";

describe("Logo", () => {
	it("renders the wordmark by default", () => {
		render(<Logo />);
		expect(screen.getByText("trackgrad")).toBeInTheDocument();
	});

	it("hides the wordmark when asked", () => {
		render(<Logo showWordmark={false} />);
		expect(screen.queryByText("trackgrad")).not.toBeInTheDocument();
	});

	it("LogoTile and LogoMark render an svg", () => {
		const { container: tile } = render(<LogoTile />);
		expect(tile.querySelector("svg")).toBeTruthy();
		const { container: mark } = render(<LogoMark />);
		expect(mark.querySelector("svg")).toBeTruthy();
	});
});
