import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, userEvent } from "@/test/utils";

const createMutate = vi.fn().mockResolvedValue({});
const updateMutate = vi.fn().mockResolvedValue({});

vi.mock("@/features/queries", () => ({
	faculties: {
		useCreate: () => ({ mutateAsync: createMutate, isPending: false }),
		useUpdate: () => ({ mutateAsync: updateMutate, isPending: false }),
	},
	universities: { useList: () => ({ data: [{ id: "u1", name: "ETH" }] }) },
}));

import { FacultyForm } from "./FacultyForm";

beforeEach(() => {
	createMutate.mockClear();
	updateMutate.mockClear();
});

describe("FacultyForm", () => {
	it("creates a faculty with a university and research-area chips", async () => {
		const user = userEvent.setup();
		const onSubmitted = vi.fn();
		render(<FacultyForm onSubmitted={onSubmitted} onCancel={vi.fn()} />);

		await user.type(screen.getByLabelText("Name"), "Prof Silva");
		await user.type(screen.getByLabelText("Email"), "silva@x.io");
		await user.selectOptions(screen.getByLabelText("University"), "u1");
		await user.type(screen.getByPlaceholderText("Add an area…"), "Robotics{Enter}");
		fireEvent.click(screen.getByRole("button", { name: "Save faculty" }));

		await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1));
		const payload = createMutate.mock.calls[0][0];
		expect(payload).toMatchObject({
			name: "Prof Silva",
			email: "silva@x.io",
			university_id: "u1",
		});
		expect(payload.research_areas).toEqual(["Robotics"]);
		expect(onSubmitted).toHaveBeenCalled();
	});
});
