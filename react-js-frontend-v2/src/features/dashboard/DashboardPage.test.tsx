import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, screen } from "@/test/utils";

let timeline: {
	data?: unknown;
	isLoading: boolean;
	isError: boolean;
	refetch: () => void;
};

vi.mock("@/features/queries", () => ({
	useTimeline: () => timeline,
}));
vi.mock("@/lib/auth/AuthContext", () => ({
	useAuth: () => ({ user: { name: "Ayşe Kaya" } }),
}));

import { DashboardPage } from "./DashboardPage";

const fullData = {
	events: [
		{ type: "University", name: "TU Delft", date: "2025-11-24T00:00:00Z" },
		{
			type: "Interview",
			name: "Prof Chen",
			designation: "Prof",
			university_name: "Toronto",
			date: "2025-12-05T00:00:00Z",
		},
	],
	appliedUniversityRatio: 0.6,
	recommendationRatio: 0.75,
	repliedMailsRatio: 0.4,
	applicationCount: 3,
};

describe("DashboardPage", () => {
	it("shows the loading state", () => {
		timeline = { isLoading: true, isError: false, refetch: vi.fn() };
		renderWithProviders(<DashboardPage />);
		expect(screen.getByText("Setting up your calm view…")).toBeInTheDocument();
	});

	it("greets the user and renders horizon, progress and counts", () => {
		timeline = { data: fullData, isLoading: false, isError: false, refetch: vi.fn() };
		renderWithProviders(<DashboardPage />);

		expect(screen.getByText(/Ayşe/)).toBeInTheDocument();
		expect(screen.getByText("On the horizon")).toBeInTheDocument();
		expect(screen.getByText("TU Delft")).toBeInTheDocument();
		expect(screen.getByText("Prof Chen")).toBeInTheDocument();
		expect(screen.getByText("Deadline")).toBeInTheDocument();
		expect(screen.getByText("Interview")).toBeInTheDocument();
		expect(screen.getByText("Where you are")).toBeInTheDocument();
		expect(screen.getByText("60%")).toBeInTheDocument();
		expect(screen.getByText("75%")).toBeInTheDocument();
		expect(screen.getByText("40%")).toBeInTheDocument();
		expect(screen.getByText(/3 applications created so far/)).toBeInTheDocument();
	});

	it("shows a calm message when there are no events", () => {
		timeline = {
			data: { ...fullData, events: [] },
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		};
		renderWithProviders(<DashboardPage />);
		expect(
			screen.getByText("Nothing on the horizon yet. Enjoy the quiet.")
		).toBeInTheDocument();
	});
});
