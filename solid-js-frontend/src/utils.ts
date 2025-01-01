import toast from "solid-toast";

export enum HttpStatus {
	OK = 200,
	CREATED = 201,
	ACCEPTED = 202,
	NO_CONTENT = 204,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
	NOT_IMPLEMENTED = 501,
	BAD_GATEWAY = 502,
	SERVICE_UNAVAILABLE = 503,
	GATEWAY_TIMEOUT = 504,
}

export const fetchData = async (url: string, data: object | null = null) => {
	try {
		let ret;
		if (data) ret = await fetch(import.meta.env.VITE_BACKEND_URL + url, data);
		else ret = await fetch(import.meta.env.VITE_BACKEND_URL + url);
		const res = await ret.json();

		if (!ret.ok) {
			if (ret.status === HttpStatus.UNAUTHORIZED) {
				if (res.error === "Invalid token") {
					toast.error("Unauthorized. Redirecting to login");
					location.href = "/login";
				} else if (res.error === "Invalid Credentials") {
					toast.error("Invalid credentials");
				}
			} else if (ret.status === HttpStatus.CONFLICT) {
				toast.error(res.error);
			}

			throw new Error(`HTTP error! status: ${ret.status}`);
		}

		if (ret.status === HttpStatus.CREATED) {
			toast.success("Successfully created");
		} else if (ret.status === HttpStatus.NO_CONTENT) {
			toast.success("No data found");
		}

		return res ? (res.data ? res.data : res) : [];
	} catch (error) {
		console.log(error);
	}
};

const getTokenHeader = () => {
	const tokenheaders = new Headers();
	tokenheaders.append(
		"Authorization",
		`Bearer ${sessionStorage.getItem("token")}`
	);

	return tokenheaders;
};

export const getAuthenticatedData = async (url: string) => {
	const data = await fetchData(url, {
		method: "GET",
		headers: getTokenHeader(),
	});

	return data;
};

export const postAuthenticatedData = async (url: string, data: any) => {
	const res = await fetchData(url, {
		method: "POST",
		headers: getTokenHeader(),
		body: JSON.stringify(data),
	});

	return res;
};
