import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

/** A QueryClient tuned for tests: no retries, no caching surprises. */
export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: 0, staleTime: 0 },
			mutations: { retry: false },
		},
	});
}

interface Options extends Omit<RenderOptions, "wrapper"> {
	route?: string;
	queryClient?: QueryClient;
}

/** Render a component wrapped in Router + QueryClientProvider. */
export function renderWithProviders(ui: ReactElement, options: Options = {}) {
	const { route = "/", queryClient = createTestQueryClient(), ...rest } = options;

	function Wrapper({ children }: { children: ReactNode }) {
		return (
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
			</QueryClientProvider>
		);
	}

	return {
		user: userEvent.setup(),
		queryClient,
		...render(ui, { wrapper: Wrapper, ...rest }),
	};
}

export * from "@testing-library/react";
export { userEvent };
