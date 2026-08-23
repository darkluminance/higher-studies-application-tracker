import type { Endpoint } from "./endpoints";

/**
 * Low-level HTTP client. Ports the behavior of the legacy SolidJS `utils.ts`:
 *  - prefixes every request with `VITE_BACKEND_URL`
 *  - attaches the Bearer token for authenticated calls
 *  - unwraps the `{ data }` envelope when present (`res.data ?? res`)
 *  - on 401 "Invalid token" → triggers logout/redirect
 *  - surfaces server error messages (e.g. 409 conflicts) via a thrown ApiError
 *
 * Cross-cutting concerns (token source, unauthorized handling, toasts) are
 * INJECTED via `configureHttp` rather than reaching for `window.location` /
 * `sessionStorage` directly — so the client stays framework-agnostic and the
 * AuthProvider wires in the real implementations at startup.
 */

export enum HttpStatus {
	OK = 200,
	CREATED = 201,
	ACCEPTED = 202,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
}

export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

interface HttpHandlers {
	/** Returns the current auth token, or null when signed out. */
	getToken: () => string | null;
	/** Called when the server rejects the token (session expired). */
	onUnauthorized: () => void;
}

const handlers: HttpHandlers = {
	getToken: () => sessionStorage.getItem("token"),
	onUnauthorized: () => {
		window.location.href = "/login";
	},
};

export function configureHttp(overrides: Partial<HttpHandlers>) {
	Object.assign(handlers, overrides);
}

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "";

export interface RequestOptions {
	/** JSON body (serialized automatically). */
	body?: unknown;
	/** Extra query params appended to the path. */
	query?: Record<string, string | number | undefined>;
	/** Attach the Bearer token (default true). */
	auth?: boolean;
	/** Raw Authorization header value — used by login (`username:password`). */
	rawAuthorization?: string;
	signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
	let url = BASE_URL + path;
	if (query) {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined && value !== null) params.set(key, String(value));
		}
		const qs = params.toString();
		if (qs) url += (url.includes("?") ? "&" : "?") + qs;
	}
	return url;
}

async function request<T = unknown>(
	method: string,
	path: string,
	options: RequestOptions = {}
): Promise<T> {
	const { body, query, auth = true, rawAuthorization, signal } = options;

	const headers = new Headers();
	if (body !== undefined) headers.set("Content-Type", "application/json");
	if (rawAuthorization) {
		headers.set("Authorization", rawAuthorization);
	} else if (auth) {
		const token = handlers.getToken();
		if (token) headers.set("Authorization", `Bearer ${token}`);
	}

	const response = await fetch(buildUrl(path, query), {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
		signal,
	});

	// Some endpoints (204) return no body; guard the JSON parse.
	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		const serverError: string =
			(payload && (payload.error || payload.message)) ||
			`Request failed (${response.status})`;

		if (response.status === HttpStatus.UNAUTHORIZED) {
			if (serverError === "Invalid token") handlers.onUnauthorized();
		}
		throw new ApiError(response.status, serverError);
	}

	// Unwrap `{ data }` envelope when present, matching the legacy contract.
	return (payload && (payload.data ?? payload)) as T;
}

/** Call an endpoint from the registry with optional body/query overrides. */
export function callEndpoint<T = unknown>(
	endpoint: Endpoint,
	options: RequestOptions = {}
): Promise<T> {
	return request<T>(endpoint.method, endpoint.path, options);
}

export const http = {
	request,
	callEndpoint,
	get: <T = unknown>(path: string, options?: RequestOptions) =>
		request<T>("GET", path, options),
	post: <T = unknown>(path: string, body?: unknown, options?: RequestOptions) =>
		request<T>("POST", path, { ...options, body }),
};
