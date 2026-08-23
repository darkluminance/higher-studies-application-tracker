import { describe, it, expect, vi } from "vitest";
import { useState } from "react";
import { render, screen, fireEvent, userEvent } from "@/test/utils";
import { Switch, SwitchRow } from "./Switch";
import { Stepper } from "./Stepper";
import { ChipField } from "./ChipField";
import { DataTable, type Column } from "./DataTable";

describe("Switch", () => {
	it("toggles and calls onCheckedChange", async () => {
		const user = userEvent.setup();
		function Harness() {
			const [on, setOn] = useState(false);
			return <Switch checked={on} onCheckedChange={setOn} aria-label="gre" />;
		}
		render(<Harness />);
		const sw = screen.getByRole("switch", { name: "gre" });
		expect(sw).toHaveAttribute("data-state", "unchecked");
		await user.click(sw);
		expect(sw).toHaveAttribute("data-state", "checked");
	});

	it("SwitchRow renders a label bound to the switch", () => {
		render(
			<SwitchRow
				id="req-gre"
				label="GRE required"
				checked={false}
				onCheckedChange={() => {}}
			/>
		);
		expect(screen.getByText("GRE required")).toBeInTheDocument();
		expect(screen.getByRole("switch")).toBeInTheDocument();
	});
});

describe("Stepper", () => {
	it("increments and decrements", () => {
		const onChange = vi.fn();
		render(<Stepper value={3} onChange={onChange} unit="letter" />);
		expect(screen.getByText("3 letters")).toBeInTheDocument();
		fireEvent.click(screen.getByLabelText("Increase"));
		expect(onChange).toHaveBeenCalledWith(4);
		fireEvent.click(screen.getByLabelText("Decrease"));
		expect(onChange).toHaveBeenCalledWith(2);
	});

	it("singularizes the unit at 1 and disables decrease at the min", () => {
		const onChange = vi.fn();
		render(<Stepper value={1} min={1} onChange={onChange} unit="letter" />);
		expect(screen.getByText("1 letter")).toBeInTheDocument();
		const dec = screen.getByLabelText("Decrease");
		expect(dec).toBeDisabled();
		fireEvent.click(dec);
		expect(onChange).not.toHaveBeenCalled();
	});

	it("disables increase at the max", () => {
		render(<Stepper value={5} max={5} onChange={vi.fn()} />);
		expect(screen.getByLabelText("Increase")).toBeDisabled();
	});
});

describe("ChipField", () => {
	function Harness({ initial = [] as string[] }) {
		const [val, setVal] = useState<string[]>(initial);
		return <ChipField value={val} onChange={setVal} placeholder="Add…" />;
	}

	it("adds a chip on Enter", async () => {
		const user = userEvent.setup();
		render(<Harness />);
		const input = screen.getByPlaceholderText("Add…");
		await user.type(input, "WES{Enter}");
		expect(screen.getByText("WES")).toBeInTheDocument();
	});

	it("ignores duplicates", async () => {
		const user = userEvent.setup();
		render(<Harness initial={["WES"]} />);
		const input = screen.getByRole("textbox");
		await user.type(input, "WES{Enter}");
		expect(screen.getAllByText("WES")).toHaveLength(1);
	});

	it("removes a chip via its × button", async () => {
		const user = userEvent.setup();
		render(<Harness initial={["ECE"]} />);
		await user.click(screen.getByLabelText("Remove ECE"));
		expect(screen.queryByText("ECE")).not.toBeInTheDocument();
	});

	it("removes the last chip on Backspace when empty", async () => {
		const user = userEvent.setup();
		render(<Harness initial={["A", "B"]} />);
		const input = screen.getByRole("textbox");
		input.focus();
		await user.keyboard("{Backspace}");
		expect(screen.queryByText("B")).not.toBeInTheDocument();
		expect(screen.getByText("A")).toBeInTheDocument();
	});
});

describe("DataTable", () => {
	interface Row {
		id: string;
		name: string;
	}
	const columns: Column<Row>[] = [
		{ key: "name", header: "Name", render: (r) => <span>{r.name}</span> },
	];
	const data: Row[] = [
		{ id: "1", name: "ETH" },
		{ id: "2", name: "TU Delft" },
	];

	it("renders headers and rows (desktop + mobile card)", () => {
		render(
			<DataTable
				columns={columns}
				data={data}
				gridTemplate="1fr"
				rowKey={(r) => r.id}
				renderMobileCard={(r) => <div>mobile-{r.name}</div>}
			/>
		);
		expect(screen.getByText("Name")).toBeInTheDocument();
		// Desktop cell + mobile card each render the name once.
		expect(screen.getAllByText("ETH").length).toBeGreaterThanOrEqual(1);
		expect(screen.getByText("mobile-TU Delft")).toBeInTheDocument();
	});

	it("calls onRowClick with the row", () => {
		const onRowClick = vi.fn();
		render(
			<DataTable
				columns={columns}
				data={data}
				gridTemplate="1fr"
				rowKey={(r) => r.id}
				onRowClick={onRowClick}
				renderMobileCard={() => <div />}
			/>
		);
		fireEvent.click(screen.getByText("ETH"));
		expect(onRowClick).toHaveBeenCalledWith(data[0]);
	});
});
