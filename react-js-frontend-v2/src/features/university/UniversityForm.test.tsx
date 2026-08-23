import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, userEvent } from "@/test/utils";
import type { University } from "@/types";

const createMutate = vi.fn().mockResolvedValue({});
const updateMutate = vi.fn().mockResolvedValue({});

vi.mock("@/features/queries", () => ({
	universities: {
		useCreate: () => ({ mutateAsync: createMutate, isPending: false }),
		useUpdate: () => ({ mutateAsync: updateMutate, isPending: false }),
	},
}));

import { UniversityForm } from "./UniversityForm";

beforeEach(() => {
	createMutate.mockClear();
	updateMutate.mockClear();
});

describe("UniversityForm", () => {
	it("creates a university with ISO dates, boolean flags and array evaluations", async () => {
		const user = userEvent.setup();
		const onSubmitted = vi.fn();
		render(<UniversityForm onSubmitted={onSubmitted} onCancel={() => {}} />);

		await user.type(screen.getByLabelText("University name"), "ETH Zürich");
		await user.click(screen.getByRole("switch", { name: "GRE required" }));
		fireEvent.click(screen.getByRole("button", { name: "Save university" }));

		await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1));
		const payload = createMutate.mock.calls[0][0];
		expect(payload.name).toBe("ETH Zürich");
		expect(payload.is_gre_must).toBe(true);
		expect(payload.is_gmat_must).toBe(false);
		expect(payload.lor_count).toBe(1);
		expect(payload.accepted_evaluations).toEqual([]);
		expect(payload.application_deadline).toMatch(/T00:00:00\.000Z$/);
		expect(payload.early_deadline).toMatch(/T00:00:00\.000Z$/);
		expect(onSubmitted).toHaveBeenCalled();
	});

	it("updates an existing university with its id", async () => {
		const initial: University = {
			id: "u1",
			name: "TU Delft",
			website: "",
			location: "Delft",
			main_ranking: 47,
			application_fee: 100,
			application_deadline: "2025-12-01T00:00:00Z",
			early_deadline: "2025-11-24T00:00:00Z",
			is_gre_must: "YES",
			is_gmat_must: false,
			lor_count: 2,
			is_official_transcript_required: false,
			is_transcript_needs_evaluation: false,
			accepted_evaluations: ["WES"],
			remarks: "",
		};
		const onSubmitted = vi.fn();
		render(
			<UniversityForm initial={initial} onSubmitted={onSubmitted} onCancel={() => {}} />
		);

		// Pre-populated from initial data.
		expect(screen.getByLabelText("University name")).toHaveValue("TU Delft");
		expect(screen.getByRole("switch", { name: "GRE required" })).toHaveAttribute(
			"data-state",
			"checked"
		);

		fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
		await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1));
		expect(updateMutate.mock.calls[0][0].id).toBe("u1");
		expect(createMutate).not.toHaveBeenCalled();
	});

	it("calls onCancel from the Cancel button", async () => {
		const onCancel = vi.fn();
		const user = userEvent.setup();
		render(<UniversityForm onSubmitted={() => {}} onCancel={onCancel} />);
		await user.click(screen.getByRole("button", { name: "Cancel" }));
		expect(onCancel).toHaveBeenCalled();
	});
});
