import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, userEvent } from "@/test/utils";
import type { Recommender } from "@/types";

const createMutate = vi.fn().mockResolvedValue({});
const updateMutate = vi.fn().mockResolvedValue({});

vi.mock("@/features/queries", () => ({
	recommenders: {
		useCreate: () => ({ mutateAsync: createMutate, isPending: false }),
		useUpdate: () => ({ mutateAsync: updateMutate, isPending: false }),
	},
}));

import { RecommenderForm } from "./RecommenderForm";

beforeEach(() => {
	createMutate.mockClear();
	updateMutate.mockClear();
});

describe("RecommenderForm", () => {
	it("creates a recommender from the entered details", async () => {
		const user = userEvent.setup();
		const onSubmitted = vi.fn();
		render(<RecommenderForm onSubmitted={onSubmitted} onCancel={vi.fn()} />);

		await user.type(screen.getByLabelText("Name"), "Dr Demir");
		await user.type(screen.getByLabelText("Email"), "demir@x.io");
		await user.type(screen.getByLabelText("Designation"), "Advisor");
		await user.type(screen.getByLabelText("Institution"), "Boğaziçi");
		await user.type(screen.getByLabelText("Relationship"), "Thesis advisor");
		fireEvent.click(screen.getByRole("button", { name: "Save recommender" }));

		await waitFor(() => expect(createMutate).toHaveBeenCalledTimes(1));
		expect(createMutate.mock.calls[0][0]).toMatchObject({
			name: "Dr Demir",
			email: "demir@x.io",
			designation: "Advisor",
			institution: "Boğaziçi",
			relationship: "Thesis advisor",
		});
		expect(onSubmitted).toHaveBeenCalled();
	});

	it("updates an existing recommender with its id", async () => {
		const initial: Recommender = {
			id: "r1",
			name: "Dr Demir",
			email: "d@x.io",
			designation: "Advisor",
			institution: "Boğaziçi",
			relationship: "Advisor",
		};
		render(<RecommenderForm initial={initial} onSubmitted={vi.fn()} onCancel={vi.fn()} />);
		fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
		await waitFor(() => expect(updateMutate).toHaveBeenCalledTimes(1));
		expect(updateMutate.mock.calls[0][0].id).toBe("r1");
	});
});
