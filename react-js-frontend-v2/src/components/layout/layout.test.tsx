import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders, screen, waitFor, userEvent } from "@/test/utils";

const logout = vi.fn();
vi.mock("@/lib/auth/AuthContext", () => ({
	useAuth: () => ({ user: { name: "Ayşe Kaya" }, logout, isAuthenticated: true }),
}));

import { AppShell } from "./AppShell";

function renderShell(route = "/university") {
	return renderWithProviders(
		<Routes>
			<Route element={<AppShell />}>
				<Route path="/university" element={<div>page content</div>} />
			</Route>
		</Routes>,
		{ route }
	);
}

beforeEach(() => logout.mockClear());

describe("AppShell + Sidebar", () => {
	it("renders the brand, grouped nav, the user and the routed page", () => {
		renderShell();
		// Brand wordmark appears (sidebar + possibly mobile). At least one.
		expect(screen.getAllByText("trackgrad").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("Universities").length).toBeGreaterThanOrEqual(1);
		// "Schools" is both a sidebar group label and a mobile tab.
		expect(screen.getAllByText("Schools").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText("Ayşe Kaya")).toBeInTheDocument();
		expect(screen.getByText("page content")).toBeInTheDocument();
	});

	it("signs out from the sidebar", async () => {
		const user = userEvent.setup();
		renderShell();
		await user.click(screen.getByLabelText("Sign out"));
		expect(logout).toHaveBeenCalledTimes(1);
	});
});

describe("MobileNav", () => {
	it("opens the full-screen menu and signs out", async () => {
		const user = userEvent.setup();
		renderShell();

		await user.click(screen.getByLabelText("More"));
		await waitFor(() =>
			expect(screen.getByRole("button", { name: /Sign out/ })).toBeInTheDocument()
		);
		await user.click(screen.getByRole("button", { name: /Sign out/ }));
		expect(logout).toHaveBeenCalled();
	});
});
