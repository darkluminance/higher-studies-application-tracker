import { createEffect, createSignal } from "solid-js";

export default function Topbar() {
	const [userdata, setUserdata] = createSignal({
		name: "",
		email: "",
		username: "",
	});

	const handleLogout = () => {
		sessionStorage.removeItem("userdata");
		sessionStorage.removeItem("token");
		window.location.reload();
	};

	createEffect(() => {
		const user = sessionStorage.getItem("userdata");
		if (user) {
			setUserdata(JSON.parse(user));
		}
	});

	return (
		<div class="w-full p-4 text-xl bg-gray-900 text-white flex justify-between">
			<span>{userdata().name}</span>
			<span onClick={handleLogout} class="cursor-pointer hover:opacity-50">
				Logout
			</span>
		</div>
	);
}
