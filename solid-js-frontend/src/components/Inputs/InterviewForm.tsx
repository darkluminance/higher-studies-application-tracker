import { createEffect, createSignal, For, onMount } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../../utils";
import toast from "solid-toast";
import { setUserData } from "../../stores/UserStore";
import LoadingButton from "../LoadingButton";
import { Interviews } from "../../models/Interview";
import { Faculties } from "../../models/Faculty";

export default function InterviewForm(
	props: { editData: Interviews; fallback: Function } | null
) {
	const [data, setData] = createSignal<Interviews>({} as Interviews);
	const [faculties, setFaculties] = createSignal([]);
	const [loading, setIsLoading] = createSignal(false);

	const fetchFaculties = async () => {
		try {
			const data = await getAuthenticatedData("/faculties/user/get");
			setFaculties(data);
		} catch (error) {
			console.error("Error fetching faculties:", error);
		}
	};

	const resetForm = () => {
		const settingData = {
			id: "",
			faculty_id: "",
			date: "",
			is_completed: false,
			remarks: "",
		};
		setData(settingData);
	};

	createEffect(() => {
		if (props?.editData) {
			setData(props.editData);
		}
	});

	onMount(() => {
		fetchFaculties();
		if (!props?.editData) resetForm();
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const { id, ...filtered } = data();
		try {
			filtered.date = new Date(filtered.date).toISOString();
		} catch (error) {
			toast.error("Please enter valid date format");
			return;
		}

		if (!filtered.faculty_id) {
			toast.error("Please select a faculty");
			return;
		}

		setIsLoading(true);

		const payload = props?.editData ? { ...filtered, id: id } : filtered;
		const url = props?.editData ? "/interviews/update" : "/interviews/create";
		const res = await postAuthenticatedData(url, payload);

		setIsLoading(false);

		if (res) {
			setUserData("isFirstTime", false);
			localStorage.setItem("isFirstTime", JSON.stringify(false));
			toast.success("Success");
		} else {
			toast.error("Could not submit data");
		}

		props?.fallback();
	};

	return (
		<form class="space-y-5" onSubmit={handleSubmit}>
			<div class="block">
				<label for="faculty">Faculty:</label>
				<div class="flex gap-4">
					<select
						id={`faculty-${data().id}`}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						value={data().faculty_id}
						onChange={(e) => setData({ ...data(), faculty_id: e.target.value })}
					>
						<option value="">Select a faculty</option>
						<For each={faculties()}>
							{(faculty: Faculties) => (
								<option
									value={faculty.id}
									selected={data().faculty_id === faculty.id}
								>
									{faculty.name}
								</option>
							)}
						</For>
					</select>
				</div>
			</div>
			<div class="block">
				<label for="date">Interview Date:</label>
				<input
					type="string"
					placeholder="YYYY-MM-DD"
					id="date"
					required
					value={data().date}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({
							...data(),
							date: e.target.value,
						})
					}
				/>
			</div>
			<div class="block">
				<label for="is_completed">Completed:</label>
				<input
					type="checkbox"
					id="is_completed"
					checked={
						data().is_completed === "YES" || Boolean(data().is_completed)
					}
					class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({ ...data(), is_completed: e.target.checked })
					}
				/>
			</div>
			<div class="block">
				<textarea
					id="remarks"
					placeholder="Remarks"
					value={data().remarks}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					rows="5"
					onInput={(e) => setData({ ...data(), remarks: e.target.value })}
				/>
			</div>

			<LoadingButton loading={loading()} text="Submit" />
		</form>
	);
}
