import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, userEvent } from "@/test/utils";

const createMutate = vi.fn().mockResolvedValue({});
const updateMutate = vi.fn().mockResolvedValue({});
const toastError = vi.fn();

vi.mock("@/features/queries", () => ({
	mails: {
		useCreate: () => ({ mutateAsync: createMutate, isPending: false }),
		useUpdate: () => ({ mutateAsync: updateMutate, isPending: false }),
	},
	faculties: { useList: () => ({ data: [{ id: "f1", name: "Prof X" }] }) },
	useEnum: () => ({ data: ["Warm", "Neutral"] }),
}));

vi.mock("@/lib/toast", () => ({
	toast: { error: (m: string) => toastError(m), success: vi.fn() },
}));

import { MailForm } from "./MailForm";

beforeEach(() => {
	createMutate.mockClear();
	updateMutate.mockClear();
	toastError.mockClear();
});

describe("MailForm", () => {
	it("guards against submitting without a faculty", async () => {
		render(<MailForm onSubmitted={vi.fn()} onCancel={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "Log this email" }));
		await waitFor(() =>
			expect(toastError).toHaveBeenCalledWith("Please choose a faculty first.")
		);
		expect(createMutate).not.toHaveBeenCalled();
	});

	it("logs an email with the selected faculty and toggles", async () => {
		const user = userEvent.setup();
		const onSubmitted = vi.fn();
		render(<MailForm onSubmitted={onSubmitted} onCancel={vi.fn()} />);

		await user.selectOptions(screen.getByLabelText("Faculty"), "f1");
		await user.click(screen.getByRole("switch", { name: "Email sent" }));
		fireEvent.click(screen.getByRole("button", { name: "Log this email" }));

		await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1));
		const payload = createMutate.mock.calls[0][0];
		expect(payload.faculty_id).toBe("f1");
		expect(payload.is_mailed).toBe(true);
		expect(onSubmitted).toHaveBeenCalled();
	});
});
