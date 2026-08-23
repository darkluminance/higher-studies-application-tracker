import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, userEvent, waitFor } from "@/test/utils";
import { Dialog } from "./Dialog";
import { FilterSelect } from "./FilterSelect";
import { RowActions } from "./RowActions";

describe("Dialog", () => {
	it("shows the title, description and children when open", () => {
		render(
			<Dialog open onOpenChange={() => {}} title="Add a university" description="Just the essentials">
				<p>form body</p>
			</Dialog>
		);
		expect(screen.getByText("Add a university")).toBeInTheDocument();
		expect(screen.getByText("Just the essentials")).toBeInTheDocument();
		expect(screen.getByText("form body")).toBeInTheDocument();
	});

	it("does not render content when closed", () => {
		render(
			<Dialog open={false} onOpenChange={() => {}} title="Hidden">
				<p>secret</p>
			</Dialog>
		);
		expect(screen.queryByText("secret")).not.toBeInTheDocument();
	});

	it("requests close via the close button", () => {
		const onOpenChange = vi.fn();
		render(
			<Dialog open onOpenChange={onOpenChange} title="Closable">
				<p>x</p>
			</Dialog>
		);
		fireEvent.click(screen.getByLabelText("Close"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});

describe("FilterSelect", () => {
	const options = [
		{ value: "u1", label: "ETH" },
		{ value: "u2", label: "TU Delft" },
	];

	it("shows the all-label when nothing is selected", () => {
		render(
			<FilterSelect value="" options={options} onChange={() => {}} allLabel="All universities" />
		);
		expect(
			screen.getByRole("button", { name: /All universities/ })
		).toBeInTheDocument();
	});

	it("shows the selected option label", () => {
		render(
			<FilterSelect value="u1" options={options} onChange={() => {}} allLabel="All universities" />
		);
		expect(screen.getByRole("button", { name: /ETH/ })).toBeInTheDocument();
	});

	it("selects an option from the menu", async () => {
		const user = userEvent.setup();
		const onChange = vi.fn();
		render(
			<FilterSelect value="" options={options} onChange={onChange} allLabel="All universities" />
		);
		await user.click(screen.getByRole("button", { name: /All universities/ }));
		await waitFor(() => expect(screen.getByText("TU Delft")).toBeInTheDocument());
		await user.click(screen.getByText("TU Delft"));
		expect(onChange).toHaveBeenCalledWith("u2");
	});
});

describe("RowActions", () => {
	it("opens the menu and fires edit / delete", async () => {
		const user = userEvent.setup();
		const onEdit = vi.fn();
		const onDelete = vi.fn();
		render(<RowActions onEdit={onEdit} onDelete={onDelete} />);

		await user.click(screen.getByLabelText("Row actions"));
		await waitFor(() => expect(screen.getByText("Edit")).toBeInTheDocument());
		await user.click(screen.getByText("Edit"));
		expect(onEdit).toHaveBeenCalledTimes(1);

		await user.click(screen.getByLabelText("Row actions"));
		await waitFor(() => expect(screen.getByText("Delete")).toBeInTheDocument());
		await user.click(screen.getByText("Delete"));
		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	it("renders extra actions", async () => {
		const user = userEvent.setup();
		const onSelect = vi.fn();
		render(
			<RowActions extra={[{ label: "Letters", onSelect }]} />
		);
		await user.click(screen.getByLabelText("Row actions"));
		await waitFor(() => expect(screen.getByText("Letters")).toBeInTheDocument());
		await user.click(screen.getByText("Letters"));
		expect(onSelect).toHaveBeenCalledTimes(1);
	});
});
