import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { http, callEndpoint, configureHttp, ApiError, HttpStatus } from "./http";

const BASE = "http://api.test/v1";

function mockResponse(
	payload: unknown,
	{ ok = true, status = 200 }: { ok?: boolean; status?: number } = {}
) {
	return {
		ok,
		status,
		json: async () => payload,
	} as Response;
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
	fetchMock = vi.fn();
	vi.stubGlobal("fetch", fetchMock);
	// Deterministic handlers per test.
	configureHttp({
		getToken: () => "tok-123",
		onUnauthorized: vi.fn(),
	});
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("http.get", () => {
	it("calls the prefixed URL with GET and a Bearer token", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse({ id: 1 }));
		const result = await http.get("/things");

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(`${BASE}/things`);
		expect(init.method).toBe("GET");
		expect((init.headers as Headers).get("Authorization")).toBe("Bearer tok-123");
		expect(init.body).toBeUndefined();
		expect(result).toEqual({ id: 1 });
	});

	it("omits the Authorization header when auth is false", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse({}));
		await http.get("/public", { auth: false });
		const init = fetchMock.mock.calls[0][1];
		expect((init.headers as Headers).get("Authorization")).toBeNull();
	});

	it("appends query params", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse([]));
		await http.get("/enums", { query: { enum_name: "reply_vibe_enum", skip: undefined } });
		expect(fetchMock.mock.calls[0][0]).toBe(`${BASE}/enums?enum_name=reply_vibe_enum`);
	});
});

describe("http.post", () => {
	it("serializes the body and sets JSON content-type", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse({ ok: true }, { status: 201 }));
		await http.post("/things", { name: "x" });

		const init = fetchMock.mock.calls[0][1];
		expect(init.method).toBe("POST");
		expect(init.body).toBe(JSON.stringify({ name: "x" }));
		expect((init.headers as Headers).get("Content-Type")).toBe("application/json");
	});
});

describe("response envelope", () => {
	it("unwraps { data } when present", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse({ data: [1, 2, 3] }));
		expect(await http.get("/list")).toEqual([1, 2, 3]);
	});

	it("returns the raw payload when there is no data field", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse({ token: "abc" }));
		expect(await http.get("/login")).toEqual({ token: "abc" });
	});
});

describe("error handling", () => {
	it("throws ApiError and triggers onUnauthorized on 401 'Invalid token'", async () => {
		const onUnauthorized = vi.fn();
		configureHttp({ getToken: () => "tok", onUnauthorized });
		fetchMock.mockResolvedValueOnce(
			mockResponse({ error: "Invalid token" }, { ok: false, status: 401 })
		);

		await expect(http.get("/secure")).rejects.toBeInstanceOf(ApiError);
		expect(onUnauthorized).toHaveBeenCalledTimes(1);
	});

	it("does not trigger onUnauthorized for other 401 errors", async () => {
		const onUnauthorized = vi.fn();
		configureHttp({ getToken: () => null, onUnauthorized });
		fetchMock.mockResolvedValueOnce(
			mockResponse({ error: "Invalid Credentials" }, { ok: false, status: 401 })
		);

		await expect(http.get("/login")).rejects.toMatchObject({
			status: 401,
			message: "Invalid Credentials",
		});
		expect(onUnauthorized).not.toHaveBeenCalled();
	});

	it("surfaces the server error message on 409", async () => {
		fetchMock.mockResolvedValueOnce(
			mockResponse({ error: "Already exists" }, { ok: false, status: HttpStatus.CONFLICT })
		);
		await expect(http.post("/things", {})).rejects.toMatchObject({
			status: 409,
			message: "Already exists",
		});
	});

	it("provides a fallback message when none is given", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse(null, { ok: false, status: 500 }));
		await expect(http.get("/boom")).rejects.toMatchObject({
			status: 500,
			message: "Request failed (500)",
		});
	});
});

describe("callEndpoint", () => {
	it("uses the endpoint's method and path", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse({ ok: 1 }));
		await callEndpoint(
			{ method: "POST", path: "/university/get" },
			{ body: { id: "u1" } }
		);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe(`${BASE}/university/get`);
		expect(init.method).toBe("POST");
		expect(init.body).toBe(JSON.stringify({ id: "u1" }));
	});

	it("uses a raw Authorization header when provided (login)", async () => {
		fetchMock.mockResolvedValueOnce(mockResponse({ token: "jwt" }));
		await callEndpoint(
			{ method: "GET", path: "/login" },
			{ auth: false, rawAuthorization: "alice:secret" }
		);
		const init = fetchMock.mock.calls[0][1];
		expect((init.headers as Headers).get("Authorization")).toBe("alice:secret");
	});
});
