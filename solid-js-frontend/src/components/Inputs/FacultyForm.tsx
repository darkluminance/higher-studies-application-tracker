import { createEffect, createSignal, onMount } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../../utils";
import toast from "solid-toast";
import { setUserData } from "../../stores/UserStore";
import LoadingButton from "../LoadingButton";
import { Faculties } from "../../models/Faculty";

export default function FacultyForm(
	props: { editData: Faculties; fallback: Function } | null
) {
	const [data, setData] = createSignal<Faculties>({} as Faculties);
	const [universities, setUniversities] = createSignal([]);
	const [loading, setIsLoading] = createSignal(false);

	const fetchUniversities = async () => {
		try {
			const data = await getAuthenticatedData("/university/user/get");
			setUniversities(data);
		} catch (error) {
			console.error("Error fetching universities:", error);
		}
	};

	const resetForm = () => {
		const settingData = {
			id: "",
			name: "",
			email: "",
			university_id: "",
			designation: "",
			research_areas: [],
			interested_papers: [],
		};
		setData(settingData);
	};

	createEffect(() => {
		if (props?.editData) {
			setData(props.editData);
		}
	});

	onMount(() => {
		fetchUniversities();
		if (!props?.editData) resetForm();
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const { id, ...filtered } = data();

		// replace the spaces at the beginning and end of each of the research_areas in the filtered object
		filtered.research_areas = filtered.research_areas.map((area) =>
			area.replace(/^\s+|\s+$/g, "")
		);

		setIsLoading(true);

		const payload = props?.editData ? { ...filtered, id: id } : filtered;
		const url = props?.editData ? "/faculties/update" : "/faculties/create";
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
				<label for="university" class="flex justify-between">
					<span>University:</span>
					<a href="/university" class="text-cyan-500">
						Create university
					</a>
				</label>
				<div class="flex gap-4">
					<select
						id={`university-${data().id}`}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						value={data().university_id}
						required
						onChange={(e) =>
							setData({ ...data(), university_id: e.target.value })
						}
					>
						<option value="">Select a university</option>
						{universities().map((uni: { id: string; name: string }) => (
							<option value={uni.id} selected={data().university_id === uni.id}>
								{uni.name}
							</option>
						))}
					</select>
				</div>
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
				<label for="name">Research Areas:</label>
				<input
					type="text"
					id="research_areas"
					value={data().research_areas}
					placeholder="Comma separated values"
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({
							...data(),
							research_areas: e.target.value.split(","),
						})
					}
				/>
			</div>
			<div class="block">
				<label for="name">Interested Papers:</label>
				<input
					type="text"
					id="interested_papers"
					value={data().interested_papers}
					placeholder="Add paper IDs or links"
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({
							...data(),
							interested_papers: e.target.value.replace(" ", "").split(","),
						})
					}
				/>
			</div>

			<LoadingButton loading={loading()} text="Submit" />
		</form>
	);
}
