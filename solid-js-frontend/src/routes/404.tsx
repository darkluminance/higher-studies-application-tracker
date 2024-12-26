import { useNavigate } from "@solidjs/router";

export default function Error404() {
	const navigate = useNavigate();

	const handleNavigate = () => {
		const token = sessionStorage.getItem("token");
		if (token) {
			navigate("/", { replace: true });
		} else {
			navigate("/login", { replace: true });
		}
	};

	return (
		<div class="flex flex-col items-center justify-center h-screen bg-gray-100">
			<h1 class="text-6xl text-red-500">404 - Page Not Found</h1>
			<p class="mt-8 text-gray-600">
				The page you're looking for doesn't exist.
			</p>
			<button
				onClick={handleNavigate}
				class="mt-8 text-cyan-500  hover:text-cyan-300 hover:underline transition-colors duration-200 w-full max-w-xs cursor-pointer text-lg"
			>
				Go Back Home
			</button>
		</div>
	);
}
