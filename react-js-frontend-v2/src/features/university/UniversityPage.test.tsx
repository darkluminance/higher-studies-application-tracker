import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, userEvent } from "@/test/utils";
import type { University } from "@/types";

let listState: {
	data?: University[];
	isLoading: boolean;
	isError: boolean;
	refetch: () => void;
};
const removeMutate = vi.fn();

vi.mock("@/features/queries", () => ({
	universities: {
		useList: () => listState,
		useRemove: () => ({ mutate: removeMutate }),
		useCreate: () => ({ mutateAsync: vi.fn(), isPending: false }),
		useUpdate: () => ({ mutateAsync: vi.fn(), isPending: false }),
	},
}));

// Isolate the page from the form's internals.
vi.mock("./UniversityForm", () => ({
	UniversityForm: () => <div>university form stub</div>,
}));

import { UniversityPage } from "./UniversityPage";

const uni: University = {
	id: "u1",
	name: "ETH Zürich",
	website: "",
	location: "Zürich",
	main_ranking: 7,
	application_fee: 150,
	application_deadline: "2025-12-15T00:00:00Z",
	early_deadline: "2025-12-01T00:00:00Z",
	is_gre_must: "YES",
	is_gmat_must: false,
	lor_count: 3,
	is_official_transcript_required: false,
	is_transcript_needs_evaluation: false,
	accepted_evaluations: [],
	remarks: "",
};

beforeEach(() => {
	removeMutate.mockClear();
	listState = { data: [], isLoading: false, isError: false, refetch: vi.fn() };
});

describe("UniversityPage", () => {
	it("shows the loading state", () => {
		listState = { isLoading: true, isError: false, refetch: vi.fn() };
		render(<UniversityPage />);
		expect(screen.getByText("Gathering things…")).toBeInTheDocument();
	});

	it("shows the calm empty state when there are no universities", () => {
		render(<UniversityPage />);
		expect(screen.getByText("Let's begin the journey")).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: /Add your first university/ })
		).toBeInTheDocument();
	});

	it("renders university rows with name, rank and GRE tag", () => {
		listState = { data: [uni], isLoading: false, isError: false, refetch: vi.fn() };
		render(<UniversityPage />);
		expect(screen.getAllByText("ETH Zürich").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("#7").length).toBeGreaterThanOrEqual(1);
		expect(screen.getAllByText("GRE").length).toBeGreaterThanOrEqual(1);
	});

	it("deletes a university via the row menu", async () => {
		const user = userEvent.setup();
		listState = { data: [uni], isLoading: false, isError: false, refetch: vi.fn() };
		render(<UniversityPage />);

		await user.click(screen.getAllByLabelText("Row actions")[0]);
		await waitFor(() => expect(screen.getByText("Delete")).toBeInTheDocument());
		await user.click(screen.getByText("Delete"));
		expect(removeMutate).toHaveBeenCalledWith("u1");
	});

	it("opens the add dialog", async () => {
		const user = userEvent.setup();
		render(<UniversityPage />);
		await user.click(screen.getByRole("button", { name: /Add your first university/ }));
		await waitFor(() =>
			expect(screen.getByText("university form stub")).toBeInTheDocument()
		);
		expect(screen.getByText("Add a university")).toBeInTheDocument();
	});

	it("filters rows by the search box", async () => {
		const user = userEvent.setup();
		const other: University = { ...uni, id: "u2", name: "TU Delft", location: "Delft" };
		listState = {
			data: [uni, other],
			isLoading: false,
			isError: false,
			refetch: vi.fn(),
		};
		render(<UniversityPage />);
		await user.type(screen.getByPlaceholderText("Search"), "Delft");
		expect(screen.getAllByText("TU Delft").length).toBeGreaterThanOrEqual(1);
		expect(screen.queryByText("ETH Zürich")).not.toBeInTheDocument();
	});
});
