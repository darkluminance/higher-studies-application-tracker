import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders, screen, waitFor, userEvent } from "@/test/utils";

const login = vi.fn();
const register = vi.fn();
const toastSuccess = vi.fn();
const toastError = vi.fn();

vi.mock("@/lib/auth/AuthContext", () => ({ useAuth: () => ({ login }) }));
vi.mock("@/lib/toast", () => ({
	toast: { success: (m: string) => toastSuccess(m), error: (m: string) => toastError(m) },
}));
vi.mock("@/lib/api", async (importOriginal) => {
	const actual = await importOriginal<Record<string, unknown>>();
	return { ...actual, authService: { register: (...a: unknown[]) => register(...a) } };
});

import { LoginPage } from "./LoginPage";
import { RegisterPage } from "./RegisterPage";

beforeEach(() => {
	login.mockReset();
	register.mockReset();
	toastSuccess.mockClear();
	toastError.mockClear();
});

describe("LoginPage", () => {
	it("signs in and navigates home", async () => {
		login.mockResolvedValue({ id: "1", name: "A" });
		const user = userEvent.setup();
		renderWithProviders(
			<Routes>
				<Route path="/login" element={<LoginPage />} />
				<Route path="/" element={<div>home page</div>} />
			</Routes>,
			{ route: "/login" }
		);

		await user.type(screen.getByLabelText("Username"), "alice");
		await user.type(screen.getByLabelText("Password"), "secret");
		await user.click(screen.getByRole("button", { name: "Sign in" }));

		expect(login).toHaveBeenCalledWith("alice", "secret");
		expect(await screen.findByText("home page")).toBeInTheDocument();
	});

	it("shows a friendly error on bad credentials", async () => {
		const { ApiError } = await import("@/lib/api");
		login.mockRejectedValue(new ApiError(401, "Invalid Credentials"));
		const user = userEvent.setup();
		renderWithProviders(
			<Routes>
				<Route path="/login" element={<LoginPage />} />
			</Routes>,
			{ route: "/login" }
		);
		await user.type(screen.getByLabelText("Username"), "x");
		await user.type(screen.getByLabelText("Password"), "y");
		await user.click(screen.getByRole("button", { name: "Sign in" }));
		await waitFor(() =>
			expect(toastError).toHaveBeenCalledWith("Those details didn't match. Try again.")
		);
	});
});

describe("RegisterPage", () => {
	it("registers and navigates to login", async () => {
		register.mockResolvedValue({ id: "1" });
		const user = userEvent.setup();
		renderWithProviders(
			<Routes>
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<div>login page</div>} />
			</Routes>,
			{ route: "/register" }
		);

		await user.type(screen.getByLabelText("Name"), "Alice A");
		await user.type(screen.getByLabelText("Username"), "alice");
		await user.type(screen.getByLabelText("Email"), "a@x.io");
		await user.type(screen.getByLabelText("Password"), "secret");
		await user.click(screen.getByRole("button", { name: "Create account" }));

		expect(register).toHaveBeenCalledWith({
			name: "Alice A",
			username: "alice",
			email: "a@x.io",
			password: "secret",
		});
		expect(await screen.findByText("login page")).toBeInTheDocument();
		expect(toastSuccess).toHaveBeenCalled();
	});
});
