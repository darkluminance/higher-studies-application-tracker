import { createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import toast from "solid-toast";

// Mock authentication function
const isAuthenticated = () => {
	return !!sessionStorage.getItem("token");
};

// Route Guard Component
const ProtectedRoute = (props) => {
	const navigate = useNavigate();

	createEffect(() => {
		if (!isAuthenticated()) {
			setTimeout(() => {
				navigate("/login", { replace: true });
			}, 1000);
		}
	});

	return isAuthenticated() ? (
		props.children
	) : (
		<div>You're not authenticated. Redirecting to Login</div>
	);
};

export default ProtectedRoute;
