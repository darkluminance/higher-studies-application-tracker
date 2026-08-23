import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, userEvent } from "@/test/utils";
import type { Interview } from "@/types";

const createMutate = vi.fn().mockResolvedValue({});
const updateMutate = vi.fn().mockResolvedValue({});
const toastError = vi.fn();

vi.mock("@/features/queries", () => ({
	interviews: {
		useCreate: () => ({ mutateAsync: createMutate, isPending: false }),
		useUpdate: () => ({ mutateAsync: updateMutate, isPending: false }),
	},
	faculties: {
		useList: () => ({ data: [{ id: "f1", name: "Prof Silva" }] }),
	},
}));

vi.mock("@/lib/toast", () => ({
	toast: { error: (m: string) => toastError(m), success: vi.fn() },
}));

import { InterviewForm } from "./InterviewForm";

beforeEach(() => {
	createMutate.mockClear();
	updateMutate.mockClear();
	toastError.mockClear();
});

describe("InterviewForm", () => {
	it("guards against submitting without a faculty", async () => {
		render(<InterviewForm onSubmitted={vi.fn()} onCancel={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "Save interview" }));
		await waitFor(() =>
			expect(toastError).toHaveBeenCalledWith("Please choose a faculty first.")
		);
		expect(createMutate).not.toHaveBeenCalled();
	});

	it("creates with formatted time and an ISO date", async () => {
		const user = userEvent.setup();
		const onSubmitted = vi.fn();
		render(<InterviewForm onSubmitted={onSubmitted} onCancel={vi.fn()} />);

		await user.selectOptions(screen.getByLabelText("Faculty"), "f1");
		fireEvent.click(screen.getByRole("button", { name: "Save interview" }));

		await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1));
		const payload = createMutate.mock.calls[0][0];
		expect(payload.faculty_id).toBe("f1");
		expect(payload.time).toBe("10:00 AM"); // default
		expect(payload.date).toMatch(/\dT/);
		expect(payload.is_completed).toBe(false);
		expect(onSubmitted).toHaveBeenCalled();
	});

	it("parses an existing time string into the pickers", () => {
		const initial: Interview = {
			id: "i1",
			faculty_id: "f1",
			date: "2025-11-28T00:00:00Z",
			time: "03:00 PM",
			is_completed: false,
			remarks: "",
		};
		render(<InterviewForm initial={initial} onSubmitted={vi.fn()} onCancel={vi.fn()} />);
		expect(screen.getByLabelText("Hour")).toHaveValue("03");
		expect(screen.getByLabelText("AM or PM")).toHaveValue("PM");
	});
});
