import { describe, it, expect, vi, beforeEach } from "vitest";
import { Routes, Route } from "react-router-dom";
import { renderWithProviders, screen, waitFor, userEvent } from "@/test/utils";

const listByApplication = vi.fn();
const universityName = vi.fn();
const setSubmitted = vi.fn().mockResolvedValue({});

vi.mock("@/lib/api", async (importOriginal) => {
	const actual = await importOriginal<Record<string, unknown>>();
	return {
		...actual,
		recommendationStatusService: {
			listByApplication: (...a: unknown[]) => listByApplication(...a),
			universityName: (...a: unknown[]) => universityName(...a),
			setSubmitted: (...a: unknown[]) => setSubmitted(...a),
		},
	};
});

import { RecommendationStatusPage } from "./RecommendationStatusPage";

function renderPage() {
	return renderWithProviders(
		<Routes>
			<Route
				path="/recommendation_status/:applicationId"
				element={<RecommendationStatusPage />}
			/>
		</Routes>,
		{ route: "/recommendation_status/a1" }
	);
}

beforeEach(() => {
	listByApplication.mockReset();
	universityName.mockReset();
	setSubmitted.mockClear();
});

describe("RecommendationStatusPage", () => {
	it("renders the letters, progress summary and toggles", async () => {
		listByApplication.mockResolvedValue([
			{ id: "r1", name: "Dr Demir", application_id: "a1", recommender_id: "x", is_lor_submitted: "YES" },
			{ id: "r2", name: "Dr Almeida", application_id: "a1", recommender_id: "y", is_lor_submitted: false },
		]);
		universityName.mockResolvedValue("ETH");
		renderPage();

		expect(await screen.findByRole("heading", { name: "ETH" })).toBeInTheDocument();
		expect(screen.getByText("Recommendation letters")).toBeInTheDocument();
		expect(screen.getByText("1 of 2 submitted")).toBeInTheDocument();
		expect(screen.getByText("Dr Demir")).toBeInTheDocument();

		const switches = screen.getAllByRole("switch");
		expect(switches[0]).toHaveAttribute("data-state", "checked");
		expect(switches[1]).toHaveAttribute("data-state", "unchecked");
	});

	it("toggles a letter's submitted state", async () => {
		listByApplication.mockResolvedValue([
			{ id: "r2", name: "Dr Almeida", application_id: "a1", recommender_id: "y", is_lor_submitted: false },
		]);
		universityName.mockResolvedValue("ETH");
		const user = userEvent.setup();
		renderPage();

		const sw = await screen.findByRole("switch");
		await user.click(sw);
		await waitFor(() => expect(setSubmitted).toHaveBeenCalledWith("r2", true));
	});

	it("shows an empty state when there are no letters", async () => {
		listByApplication.mockResolvedValue([]);
		universityName.mockResolvedValue("ETH");
		renderPage();
		expect(await screen.findByText("No letters to track yet")).toBeInTheDocument();
	});
});
