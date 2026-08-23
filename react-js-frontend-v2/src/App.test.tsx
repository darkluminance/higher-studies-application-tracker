import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Smoke test of the composition root: real providers + router. With no token,
// the protected index route redirects to the login screen.
describe("App", () => {
	it("mounts and lands on the login screen when unauthenticated", async () => {
		render(<App />);
		expect(await screen.findByText("Welcome back")).toBeInTheDocument();
	});
});
