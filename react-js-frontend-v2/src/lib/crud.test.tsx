import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "@/test/utils";
import { ApiError } from "@/lib/api";

const toastSuccess = vi.fn();
const toastError = vi.fn();
vi.mock("@/lib/toast", () => ({
	toast: {
		success: (m: string) => toastSuccess(m),
		error: (m: string) => toastError(m),
	},
}));

import { createCrudHooks } from "./crud";

function makeService() {
	return {
		list: vi.fn().mockResolvedValue([{ id: "1" }]),
		create: vi.fn().mockResolvedValue({ id: "2" }),
		update: vi.fn().mockResolvedValue({ id: "1" }),
		remove: vi.fn().mockResolvedValue({}),
	};
}

function setup(service: ReturnType<typeof makeService>) {
	const queryClient = createTestQueryClient();
	const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
	const hooks = createCrudHooks({
		key: "things",
		service,
		labels: { created: "Created!", updated: "Updated!", deleted: "Deleted!" },
	});
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	return { hooks, wrapper, invalidateSpy };
}

beforeEach(() => {
	toastSuccess.mockClear();
	toastError.mockClear();
});

describe("createCrudHooks", () => {
	it("useList fetches from the service", async () => {
		const service = makeService();
		const { hooks, wrapper } = setup(service);
		const { result } = renderHook(() => hooks.useList(), { wrapper });

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(service.list).toHaveBeenCalledTimes(1);
		expect(result.current.data).toEqual([{ id: "1" }]);
	});

	it("useCreate calls the service, toasts success and invalidates the list", async () => {
		const service = makeService();
		const { hooks, wrapper, invalidateSpy } = setup(service);
		const { result } = renderHook(() => hooks.useCreate(), { wrapper });

		result.current.mutate({ name: "x" } as never);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(service.create).toHaveBeenCalledWith({ name: "x" });
		expect(toastSuccess).toHaveBeenCalledWith("Created!");
		expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["things", "list"] });
	});

	it("useUpdate toasts the update label", async () => {
		const service = makeService();
		const { hooks, wrapper } = setup(service);
		const { result } = renderHook(() => hooks.useUpdate(), { wrapper });

		result.current.mutate({ id: "1", name: "y" } as never);
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(service.update).toHaveBeenCalled();
		expect(toastSuccess).toHaveBeenCalledWith("Updated!");
	});

	it("useRemove toasts the delete label", async () => {
		const service = makeService();
		const { hooks, wrapper } = setup(service);
		const { result } = renderHook(() => hooks.useRemove(), { wrapper });

		result.current.mutate("1");
		await waitFor(() => expect(result.current.isSuccess).toBe(true));
		expect(service.remove).toHaveBeenCalledWith("1");
		expect(toastSuccess).toHaveBeenCalledWith("Deleted!");
	});

	it("surfaces an ApiError message on failure", async () => {
		const service = makeService();
		service.create.mockRejectedValueOnce(new ApiError(409, "Duplicate"));
		const { hooks, wrapper } = setup(service);
		const { result } = renderHook(() => hooks.useCreate(), { wrapper });

		result.current.mutate({} as never);
		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(toastError).toHaveBeenCalledWith("Duplicate");
	});

	it("falls back to a generic message for non-ApiError failures", async () => {
		const service = makeService();
		service.remove.mockRejectedValueOnce(new Error("network"));
		const { hooks, wrapper } = setup(service);
		const { result } = renderHook(() => hooks.useRemove(), { wrapper });

		result.current.mutate("1");
		await waitFor(() => expect(result.current.isError).toBe(true));
		expect(toastError).toHaveBeenCalledWith("Could not remove.");
	});
});
