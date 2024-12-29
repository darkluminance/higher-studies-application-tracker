import { fetchData, getAuthenticatedData } from "../utils";
import { setUserData } from "../stores/UserStore";
import toast from "solid-toast";
import LoadingButton from "../components/LoadingButton";
import { createSignal } from "solid-js";

export default function Login() {
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const username = formData.get("username");
		const password = formData.get("password");

		const headers = new Headers();
		headers.append("Authorization", `${username}:${password}`);

		setLoading(true);

		const response = await fetchData("/login", {
			method: "GET",
			headers: headers,
		});

		setLoading(false);

		if (response.token) {
			setLoading(true);
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
		<div class="flex flex-col h-screen items-center justify-center bg-gray-50 text-gray-600">
			<div class="text-4xl flex flex-row items-center gap-4 mb-4 tracker-header">
				Higher Studies Application Tracker
			</div>
			<p class="text-xl font-thin ">
				Track the journey to your dream destination in one place
			</p>
			<div class="w-full mt-8 max-w-md p-10 bg-white rounded-lg shadow-md">
				<h1 class="text-xl font-semibold mb-4">SIGN IN</h1>
				<form class="space-y-5" onSubmit={handleSubmit}>
					<label class="block">
						<span class="text-gray-500">Username</span>
						<input
							type="text"
							name="username"
							required
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						/>
					</label>
					<label class="block">
						<span class="text-gray-500">Password</span>
						<input
							type="password"
							name="password"
							required
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						/>
					</label>
					<LoadingButton loading={loading()} text="Login"></LoadingButton>
				</form>
				<a
					href="/register"
					class="block text-center text-sm text-gray-500 hover:text-gray-600 mt-4"
				>
					Don't have an account? <strong>Register here</strong>
				</a>
			</div>
		</div>
	);
}
