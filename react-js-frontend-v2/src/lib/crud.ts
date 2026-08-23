import {
	useMutation,
	useQuery,
	useQueryClient,
	type UseQueryOptions,
} from "@tanstack/react-query";
import { toast } from "@/lib/toast";
import { ApiError } from "@/lib/api";

interface CrudService<TItem, TCreate, TUpdate extends { id: string }> {
	list: () => Promise<TItem[]>;
	create: (input: TCreate) => Promise<TItem>;
	update: (input: TUpdate) => Promise<TItem>;
	remove: (id: string) => Promise<unknown>;
}

interface CrudLabels {
	created?: string;
	updated?: string;
	deleted?: string;
}

const messageFor = (err: unknown, fallback: string) =>
	err instanceof ApiError ? err.message : fallback;

/**
 * Builds the TanStack-Query hooks for a standard list/create/update/delete
 * entity: cached list, mutations with calm toasts + automatic invalidation.
 * Pages consume these hooks and never touch services or paths directly.
 */
export function createCrudHooks<
	TItem,
	TCreate,
	TUpdate extends { id: string },
>(opts: {
	key: string;
	service: CrudService<TItem, TCreate, TUpdate>;
	labels?: CrudLabels;
}) {
	const { key, service, labels } = opts;
	const listKey = [key, "list"] as const;

	const useList = (
		options?: Omit<UseQueryOptions<TItem[]>, "queryKey" | "queryFn">
	) =>
		useQuery({
			queryKey: listKey,
			queryFn: () => service.list(),
			...options,
		});

	const useCreate = () => {
		const qc = useQueryClient();
		return useMutation({
			mutationFn: (input: TCreate) => service.create(input),
			onSuccess: () => {
				toast.success(labels?.created ?? "Saved");
				qc.invalidateQueries({ queryKey: listKey });
			},
			onError: (err) =>
				toast.error(messageFor(err, "Something went wrong. Please try again.")),
		});
	};

	const useUpdate = () => {
		const qc = useQueryClient();
		return useMutation({
			mutationFn: (input: TUpdate) => service.update(input),
			onSuccess: () => {
				toast.success(labels?.updated ?? "Updated");
				qc.invalidateQueries({ queryKey: listKey });
			},
			onError: (err) =>
				toast.error(messageFor(err, "Something went wrong. Please try again.")),
		});
	};

	const useRemove = () => {
		const qc = useQueryClient();
		return useMutation({
			mutationFn: (id: string) => service.remove(id),
			onSuccess: () => {
				toast.success(labels?.deleted ?? "Removed");
				qc.invalidateQueries({ queryKey: listKey });
			},
			onError: (err) => toast.error(messageFor(err, "Could not remove.")),
		});
	};

	return { listKey, useList, useCreate, useUpdate, useRemove };
}
