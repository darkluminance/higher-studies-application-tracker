import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route, useLocation } from "react-router-dom";
import { renderWithProviders, screen, waitFor, userEvent } from "@/test/utils";

const login = vi.fn();
const currentUser = vi.fn();
const configureHttp = vi.fn();

vi.mock("@/lib/api", () => ({
	authService: {
		login: (...a: unknown[]) => login(...a),
		currentUser: () => currentUser(),
	},
	configureHttp: (...a: unknown[]) => configureHttp(...a),
}));

import { AuthProvider, useAuth } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

function LocationText() {
	return <span data-testid="loc">{useLocation().pathname}</span>;
}

function Probe() {
	const a = useAuth();
	return (
		<div>
			<span data-testid="auth">{String(a.isAuthenticated)}</span>
			<span data-testid="user">{a.user?.name ?? "none"}</span>
			<button onClick={() => a.login("alice", "pw")}>login</button>
			<button onClick={() => a.logout()}>logout</button>
			<LocationText />
		</div>
	);
}

beforeEach(() => {
	sessionStorage.clear();
	login.mockReset();
	currentUser.mockReset();
	configureHttp.mockReset();
});

describe("AuthProvider", () => {
	it("wires the HTTP client on mount", () => {
		renderWithProviders(
			<AuthProvider>
				<Probe />
			</AuthProvider>
		);
		expect(configureHttp).toHaveBeenCalled();
	});

	it("logs in: stores the token, loads the user, flips isAuthenticated", async () => {
		login.mockResolvedValue({ token: "jwt-1" });
		currentUser.mockResolvedValue({ id: "1", name: "Alice", username: "alice", email: "a@x.io" });
		const user = userEvent.setup();

		renderWithProviders(
			<AuthProvider>
				<Probe />
			</AuthProvider>
		);
		expect(screen.getByTestId("auth")).toHaveTextContent("false");

		await user.click(screen.getByText("login"));

		await waitFor(() => expect(screen.getByTestId("user")).toHaveTextContent("Alice"));
		expect(screen.getByTestId("auth")).toHaveTextContent("true");
		expect(sessionStorage.getItem("token")).toBe("jwt-1");
	});

	it("logs out: clears storage and redirects to /login", async () => {
		login.mockResolvedValue({ token: "jwt-1" });
		currentUser.mockResolvedValue({ id: "1", name: "Alice", username: "alice", email: "a@x.io" });
		const user = userEvent.setup();

		renderWithProviders(
			<AuthProvider>
				<Probe />
			</AuthProvider>
		);
		await user.click(screen.getByText("login"));
		await waitFor(() => expect(screen.getByTestId("auth")).toHaveTextContent("true"));

		await user.click(screen.getByText("logout"));
		await waitFor(() => expect(screen.getByTestId("loc")).toHaveTextContent("/login"));
		expect(screen.getByTestId("auth")).toHaveTextContent("false");
		expect(sessionStorage.getItem("token")).toBeNull();
	});

	it("rehydrates the user from an existing token on mount", async () => {
		sessionStorage.setItem("token", "existing");
		currentUser.mockResolvedValue({ id: "9", name: "Bob", username: "bob", email: "b@x.io" });

		renderWithProviders(
			<AuthProvider>
				<Probe />
			</AuthProvider>
		);
		await waitFor(() => expect(screen.getByTestId("user")).toHaveTextContent("Bob"));
		expect(currentUser).toHaveBeenCalled();
	});
});

describe("ProtectedRoute", () => {
	function renderGuard(route: string) {
		return renderWithProviders(
			<AuthProvider>
				<Routes>
					<Route path="/login" element={<div>login page</div>} />
					<Route element={<ProtectedRoute />}>
						<Route path="/secret" element={<div>secret page</div>} />
					</Route>
				</Routes>
			</AuthProvider>,
			{ route }
		);
	}

	it("redirects to /login without a token", () => {
		renderGuard("/secret");
		expect(screen.getByText("login page")).toBeInTheDocument();
		expect(screen.queryByText("secret page")).not.toBeInTheDocument();
	});

	it("renders the protected content when a token exists", async () => {
		sessionStorage.setItem("token", "tok");
		currentUser.mockResolvedValue({ id: "1", name: "A", username: "a", email: "a@x.io" });
		renderGuard("/secret");
		// findBy flushes the async user rehydration inside act().
		expect(await screen.findByText("secret page")).toBeInTheDocument();
	});
});
