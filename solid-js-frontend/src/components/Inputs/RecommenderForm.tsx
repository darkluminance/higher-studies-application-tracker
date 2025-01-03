import { createEffect, createSignal, onMount } from "solid-js";
import { postAuthenticatedData } from "../../utils";
import toast from "solid-toast";
import { setUserData } from "../../stores/UserStore";
import LoadingButton from "../LoadingButton";
import { Recommenders } from "../../models/Recommender";

export default function RecommenderForm(
	props: { editData: Recommenders; fallback: Function } | null
) {
	const [data, setData] = createSignal<Recommenders>({} as Recommenders);
	const [loading, setIsLoading] = createSignal(false);

	const resetForm = () => {
		const settingData = {
			id: "",
			name: "",
			email: "",
			designation: "",
			institution: "",
			relationship: "",
		};
		setData(settingData);
	};

	createEffect(() => {
		if (props?.editData) {
			setData(props.editData);
		}
	});

	onMount(() => {
		if (!props?.editData) resetForm();
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const { id, ...filtered } = data();

		setIsLoading(true);

		const payload = props?.editData ? { ...filtered, id: id } : filtered;
		const url = props?.editData
			? "/recommenders/update"
			: "/recommenders/create";
		const res = await postAuthenticatedData(url, payload);

		setIsLoading(false);

		if (res) {
			setUserData("isFirstTime", false);
			localStorage.setItem("isFirstTime", JSON.stringify(false));
			props?.fallback();
		}
	};

	return (
		<form class="space-y-5" onSubmit={handleSubmit}>
			<div class="block">
				<label for="name">Name:</label>
				<input
					type="text"
					id="name"
					value={data().name}
					required
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), name: e.target.value })}
				/>
			</div>
			<div class="block">
				<label for="email">Email:</label>
				<input
					type="text"
					id="email"
					value={data().email}
					required
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), email: e.target.value })}
				/>
			</div>
			<div class="block">
				<label for="designation">Designation:</label>
				<input
					type="text"
					id="designation"
					value={data().designation}
					required
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), designation: e.target.value })}
				/>
			</div>
			<div class="block">
				<label for="institution">Institution:</label>
				<input
					type="text"
					id="institution"
					value={data().institution}
					required
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), institution: e.target.value })}
				/>
			</div>
			<div class="block">
				<label for="relationship">Relationship:</label>
				<input
					type="text"
					id="relationship"
					value={data().relationship}
					required
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), relationship: e.target.value })}
				/>
			</div>

			<LoadingButton loading={loading()} text="Submit" />
		</form>
	);
}
