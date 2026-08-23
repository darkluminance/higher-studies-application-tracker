import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@/test/utils";
import { Button } from "./Button";
import { StatusPill, toneForStatus } from "./StatusPill";
import { Tag } from "./Tag";
import { Avatar, initialsOf } from "./Avatar";
import { ProgressBar, ProgressLabel } from "./ProgressBar";
import { Field, MicroLabel } from "./Field";
import { Input, Textarea, Select } from "./Input";
import { EmptyState } from "./EmptyState";
import { PageHeader } from "./PageHeader";
import { Spinner } from "./Spinner";
import { Card } from "./Card";

describe("Button", () => {
	it("renders its children and fires onClick", () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Save</Button>);
		fireEvent.click(screen.getByRole("button", { name: "Save" }));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("defaults to type=button and the primary clay variant", () => {
		render(<Button>Go</Button>);
		const btn = screen.getByRole("button", { name: "Go" });
		expect(btn).toHaveAttribute("type", "button");
		expect(btn.className).toContain("bg-clay");
	});

	it("shows a spinner and is disabled while loading", () => {
		render(<Button loading>Saving</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("respects the disabled prop", () => {
		const onClick = vi.fn();
		render(
			<Button disabled onClick={onClick}>
				Nope
			</Button>
		);
		fireEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});
});

describe("toneForStatus", () => {
	it("maps status text to calm tones", () => {
		expect(toneForStatus("Submitted")).toBe("sage");
		expect(toneForStatus("Completed")).toBe("sage");
		expect(toneForStatus("Interview")).toBe("plum");
		expect(toneForStatus("In progress")).toBe("motion");
		expect(toneForStatus("Waiting")).toBe("amber");
		expect(toneForStatus("Not applied")).toBe("stone");
		expect(toneForStatus("something else")).toBe("stone");
	});
});

describe("StatusPill", () => {
	it("renders its label", () => {
		render(<StatusPill tone="sage">Submitted</StatusPill>);
		expect(screen.getByText("Submitted")).toBeInTheDocument();
	});

	it("amber tone drops the pill background", () => {
		render(<StatusPill tone="amber">Waiting</StatusPill>);
		expect(screen.getByText("Waiting").className).toContain("bg-transparent");
	});
});

describe("Tag", () => {
	it("renders a research-area label", () => {
		render(<Tag tone="sage">Robotics</Tag>);
		expect(screen.getByText("Robotics")).toBeInTheDocument();
	});
});

describe("initialsOf", () => {
	it("strips honorifics and takes up to two initials", () => {
		expect(initialsOf("Prof. Lena Hoffmann")).toBe("LH");
		expect(initialsOf("Dr. Ayşe Demir")).toBe("AD");
	});
	it("handles single names", () => {
		expect(initialsOf("madonna")).toBe("M");
	});
});

describe("Avatar", () => {
	it("shows the person's initials", () => {
		render(<Avatar name="Michael Kraus" />);
		expect(screen.getByText("MK")).toBeInTheDocument();
	});
});

describe("ProgressBar", () => {
	it("sets width from the ratio and exposes aria values", () => {
		render(<ProgressBar value={0.5} />);
		const bar = screen.getByRole("progressbar");
		expect(bar).toHaveAttribute("aria-valuenow", "50");
		const fill = bar.firstElementChild as HTMLElement;
		expect(fill.style.width).toBe("50%");
	});

	it("clamps out-of-range values", () => {
		render(<ProgressBar value={2} />);
		const fill = screen.getByRole("progressbar").firstElementChild as HTMLElement;
		expect(fill.style.width).toBe("100%");
	});

	it("uses the sage fill for the positive tone", () => {
		render(<ProgressBar value={0.3} tone="sage" />);
		const fill = screen.getByRole("progressbar").firstElementChild as HTMLElement;
		expect(fill.className).toContain("bg-sage-bar");
	});
});

describe("ProgressLabel", () => {
	it("renders label and value", () => {
		render(<ProgressLabel label="Applications" value="60%" />);
		expect(screen.getByText("Applications")).toBeInTheDocument();
		expect(screen.getByText("60%")).toBeInTheDocument();
	});
});

describe("Field & inputs", () => {
	it("associates the label with its control via htmlFor", () => {
		render(
			<Field label="Name" htmlFor="name">
				<Input id="name" />
			</Field>
		);
		expect(screen.getByLabelText("Name")).toBeInTheDocument();
	});

	it("renders a hint", () => {
		render(
			<Field label="Eval" hint="e.g. WES">
				<Input />
			</Field>
		);
		expect(screen.getByText("e.g. WES")).toBeInTheDocument();
	});

	it("MicroLabel renders text", () => {
		render(<MicroLabel>Overview</MicroLabel>);
		expect(screen.getByText("Overview")).toBeInTheDocument();
	});

	it("Textarea and Select render", () => {
		render(
			<>
				<Textarea aria-label="notes" />
				<Select aria-label="pick">
					<option value="a">A</option>
				</Select>
			</>
		);
		expect(screen.getByLabelText("notes")).toBeInTheDocument();
		expect(screen.getByLabelText("pick")).toBeInTheDocument();
	});
});

describe("EmptyState", () => {
	it("renders title, body, action and footnote", () => {
		render(
			<EmptyState
				title="Begin"
				body="Add one."
				action={<button>Add</button>}
				footnote="No rush."
			/>
		);
		expect(screen.getByText("Begin")).toBeInTheDocument();
		expect(screen.getByText("Add one.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
		expect(screen.getByText("No rush.")).toBeInTheDocument();
	});
});

describe("PageHeader", () => {
	it("renders title, subtitle and actions", () => {
		render(
			<PageHeader
				title="Universities"
				subtitle="Your list"
				actions={<button>Add</button>}
			/>
		);
		expect(
			screen.getByRole("heading", { name: "Universities" })
		).toBeInTheDocument();
		expect(screen.getByText("Your list")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
	});
});

describe("Spinner & Card", () => {
	it("Spinner has a status role", () => {
		render(<Spinner />);
		expect(screen.getByRole("status")).toBeInTheDocument();
	});
	it("Card renders children", () => {
		render(<Card>content</Card>);
		expect(screen.getByText("content")).toBeInTheDocument();
	});
});
