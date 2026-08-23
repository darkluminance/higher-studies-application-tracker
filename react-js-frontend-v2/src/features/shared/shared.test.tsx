import { describe, it, expect, vi } from "vitest";
import { renderWithProviders, render, screen, fireEvent, act } from "@/test/utils";
import { renderHook } from "@testing-library/react";
import { Loading, ErrorState } from "./PageState";
import { NotFoundPage } from "./NotFoundPage";
import { useFormDialog } from "./useFormDialog";

describe("PageState", () => {
	it("Loading shows a default label", () => {
		render(<Loading />);
		expect(screen.getByText("Gathering things…")).toBeInTheDocument();
	});

	it("Loading accepts a custom label", () => {
		render(<Loading label="Please hold" />);
		expect(screen.getByText("Please hold")).toBeInTheDocument();
	});

	it("ErrorState renders a message and fires retry", () => {
		const onRetry = vi.fn();
		render(<ErrorState onRetry={onRetry} />);
		expect(screen.getByText("We couldn't load this just now.")).toBeInTheDocument();
		fireEvent.click(screen.getByText("Try again"));
		expect(onRetry).toHaveBeenCalledTimes(1);
	});

	it("ErrorState hides the retry button when no handler is given", () => {
		render(<ErrorState message="Nope" />);
		expect(screen.getByText("Nope")).toBeInTheDocument();
		expect(screen.queryByText("Try again")).not.toBeInTheDocument();
	});
});

describe("NotFoundPage", () => {
	it("renders the calm 404 with a link home", () => {
		renderWithProviders(<NotFoundPage />);
		expect(screen.getByText("This page wandered off")).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "Back home" })).toHaveAttribute("href", "/");
	});
});

describe("useFormDialog", () => {
	it("opens for create, opens for edit and resets on close", () => {
		const { result } = renderHook(() => useFormDialog<{ id: string }>());

		expect(result.current.open).toBe(false);
		expect(result.current.editing).toBeNull();

		act(() => result.current.openCreate());
		expect(result.current.open).toBe(true);
		expect(result.current.editing).toBeNull();

		act(() => result.current.openEdit({ id: "x" }));
		expect(result.current.open).toBe(true);
		expect(result.current.editing).toEqual({ id: "x" });

		act(() => result.current.close());
		expect(result.current.open).toBe(false);
		expect(result.current.editing).toBeNull();
	});
});
