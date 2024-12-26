import { fetchData } from "../utils";

export default function Register() {
	const handleSubmit = async (event) => {
		event.preventDefault();

		const formData = new FormData(event.target);

		const data = {
			name: formData.get("name"),
			username: formData.get("username"),
			email: formData.get("email"),
			password: formData.get("password"),
		};

		const response = await fetchData("/users/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (response) window.location.href = "/login";
	};
	return (
		<div class="flex h-screen items-center justify-center bg-gray-50 text-gray-600">
			<div class="w-full max-w-md p-10 bg-white rounded-lg shadow-md">
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
					<input
						type="submit"
						value="Register"
						class="w-full px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none"
					/>
				</form>
				<a
					href="/login"
					class="block text-center text-sm text-gray-500 hover:text-gray-600 mt-4"
				>
					Already have an account? Login here.
				</a>
			</div>
		</div>
	);
}
