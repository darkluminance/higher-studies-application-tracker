import { fetchData, getAuthenticatedData } from "../utils";
import { setUserData } from "../stores/UserStore";
import toast from "solid-toast";

export default function Login() {
	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const username = formData.get("username");
		const password = formData.get("password");

		const headers = new Headers();
		headers.append("Authorization", `${username}:${password}`);

		const response = await fetchData("/login", {
			method: "GET",
			headers: headers,
		});

		if (response.token) {
			sessionStorage.setItem("token", response.token);
			toast.success("Login successful. Redirecting to dashboard");

			setTimeout(async () => {
				const userdata = await getAuthenticatedData("/users/user/get");
				sessionStorage.setItem("userdata", JSON.stringify(userdata));
				setUserData("userData", userdata);
				window.location.href = "/";
			}, 1000);
		}
	};
	return (
		<div class="flex h-screen items-center justify-center bg-gray-50 text-gray-600">
			<div class="w-full max-w-md p-10 bg-white rounded-lg shadow-md">
				<h1 class="text-xl font-semibold mb-4">SIGN IN</h1>
				<form class="space-y-5" onSubmit={handleSubmit}>
					<label class="block">
						<span class="text-gray-500">Username</span>
						<input
							type="text"
							name="username"
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						/>
					</label>
					<label class="block">
						<span class="text-gray-500">Password</span>
						<input
							type="password"
							name="password"
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						/>
					</label>
					<input
						type="submit"
						value="Login"
						class="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none"
					/>
				</form>
				<a
					href="/register"
					class="block text-center text-sm text-gray-500 hover:text-gray-600 mt-4"
				>
					Don't have an account? Register here.
				</a>
			</div>
		</div>
	);
}
