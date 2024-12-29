import { createSignal } from "solid-js";
import LoadingButton from "../components/LoadingButton";
import { fetchData } from "../utils";

export default function Register() {
	const [loading, setLoading] = createSignal(false);

	const handleSubmit = async (event: SubmitEvent) => {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const data = {
			name: formData.get("name"),
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
		};
		setLoading(true);

		const response = await fetchData("/users/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (response) window.location.href = "/login";

		setLoading(false);
	};
	return (
		<div class="flex flex-col h-screen items-center justify-center bg-gray-50 text-gray-600">
			<div class="text-4xl flex flex-row items-center gap-4 mb-4 tracker-header">
				Higher Studies Application Tracker
			</div>
			<p class="text-xl font-thin ">
				Track the journey to your dream destination in one place
			</p>
			<div class="w-full max-w-md p-10 bg-white rounded-lg shadow-md mt-8">
				<h1 class="text-xl font-semibold mb-4">SIGN UP</h1>
				<form class="space-y-5" onSubmit={handleSubmit}>
					<label class="block">
						<span class="text-gray-500">Name</span>
						<input
							type="text"
							name="name"
							required
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						/>
					</label>
					<label class="block">
						<span class="text-gray-500">Email</span>
						<input
							type="email"
							name="email"
							required
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						/>
					</label>
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
							type="text"
							name="password"
							required
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						/>
					</label>

					<LoadingButton loading={loading()} text="Login"></LoadingButton>
				</form>
				<a
					href="/login"
					class="block text-center text-sm text-gray-500 hover:text-gray-600 mt-4"
				>
					Already have an account? <strong>Login here</strong>
				</a>
			</div>
		</div>
	);
}
