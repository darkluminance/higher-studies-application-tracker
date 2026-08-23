import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within, userEvent } from "@/test/utils";

const createMutate = vi.fn().mockResolvedValue({});
const updateMutate = vi.fn().mockResolvedValue({});
const toastError = vi.fn();

vi.mock("@/features/queries", () => ({
	applications: {
		useCreate: () => ({ mutateAsync: createMutate, isPending: false }),
		useUpdate: () => ({ mutateAsync: updateMutate, isPending: false }),
	},
	universities: {
		useList: () => ({ data: [{ id: "u1", name: "ETH", lor_count: 2 }] }),
	},
	recommenders: {
		useList: () => ({ data: [{ id: "r1", name: "R1" }] }),
	},
	useFacultiesByUniversity: () => ({ data: [{ id: "fa1", name: "Fac" }] }),
	useEnum: (name: string) => ({
		data:
			name === "application_type_enum"
				? ["MASTERS", "PHD"]
				: ["NOT APPLIED", "SUBMITTED"],
	}),
}));

vi.mock("@/lib/toast", () => ({
	toast: { error: (m: string) => toastError(m), success: vi.fn() },
}));

import { ApplicationForm } from "./ApplicationForm";

function recommenderSelects() {
	return screen
		.getAllByRole("combobox")
		.filter((el) => within(el).queryByRole("option", { name: "R1" }));
}

beforeEach(() => {
	createMutate.mockClear();
	updateMutate.mockClear();
	toastError.mockClear();
});

describe("ApplicationForm", () => {
	it("guards against submitting without a university", async () => {
		render(<ApplicationForm onSubmitted={vi.fn()} onCancel={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "Save application" }));
		await waitFor(() =>
			expect(toastError).toHaveBeenCalledWith("Please choose a university first.")
		);
		expect(createMutate).not.toHaveBeenCalled();
	});

	it("creates with defaulted enums and filtered recommenders", async () => {
		const user = userEvent.setup();
		const onSubmitted = vi.fn();
		render(<ApplicationForm onSubmitted={onSubmitted} onCancel={vi.fn()} />);

		await user.selectOptions(screen.getByLabelText("University"), "u1");
		await user.click(screen.getByRole("button", { name: /Add recommender/ }));
		await user.selectOptions(recommenderSelects()[0], "r1");

		fireEvent.click(screen.getByRole("button", { name: "Save application" }));

		await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1));
		const payload = createMutate.mock.calls[0][0];
		expect(payload.university_id).toBe("u1");
		expect(payload.application_type).toBe("MASTERS");
		expect(payload.application_status).toBe("NOT APPLIED");
		expect(payload.recommenders_id).toEqual(["r1"]);
		expect(onSubmitted).toHaveBeenCalled();
	});

	it("rejects duplicate recommenders", async () => {
		const user = userEvent.setup();
		render(<ApplicationForm onSubmitted={vi.fn()} onCancel={vi.fn()} />);

		await user.selectOptions(screen.getByLabelText("University"), "u1");
		await user.click(screen.getByRole("button", { name: /Add recommender/ }));
		await user.click(screen.getByRole("button", { name: /Add recommender/ }));
		const selects = recommenderSelects();
		await user.selectOptions(selects[0], "r1");
		await user.selectOptions(selects[1], "r1");

		fireEvent.click(screen.getByRole("button", { name: "Save application" }));
		await waitFor(() =>
			expect(toastError).toHaveBeenCalledWith("Duplicated recommenders aren't allowed.")
		);
		expect(createMutate).not.toHaveBeenCalled();
	});
});
