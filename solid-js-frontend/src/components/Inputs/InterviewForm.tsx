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
			date: new Date().toISOString().split("T")[0],
			time: "10:00 AM",
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
			props?.fallback();
		}
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
				<div class="grid grid-cols-3 gap-2 mt-2">
					<div class="flex flex-col">
						<select
							id="interview_day"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().date?.split("-")[2] || ""}
							required
							onInput={(e) => {
								const [year, month] = data().date?.split("-") || ["", ""];
								setData({
									...data(),
									date: `${year || new Date().getFullYear()}-${month || "01"}-${
										e.target.value
									}`,
								});
							}}
						>
							{Array.from({ length: 31 }, (_, i) => {
								const day = (i + 1).toString().padStart(2, "0");
								return <option value={day}>{day}</option>;
							})}
						</select>
					</div>
					<div class="flex flex-col">
						<select
							id="interview_month"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().date?.split("-")[1] || ""}
							required
							onInput={(e) => {
								const [year, _, day] = data().date?.split("-") || ["", "", ""];
								setData({
									...data(),
									date: `${year || new Date().getFullYear()}-${
										e.target.value
									}-${day || "01"}`,
								});
							}}
						>
							{Array.from({ length: 12 }, (_, i) => {
								const month = (i + 1).toString().padStart(2, "0");
								const monthName = new Date(2000, i).toLocaleString("default", {
									month: "long",
								});
								return <option value={month}>{monthName}</option>;
							})}
						</select>
					</div>
					<div class="flex flex-col">
						<select
							id="interview_year"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().date?.split("-")[0] || ""}
							required
							onInput={(e) => {
								const [_, month, day] = data().date?.split("-") || ["", "", ""];
								setData({
									...data(),
									date: `${e.target.value}-${month || "01"}-${day || "01"}`,
								});
							}}
						>
							{Array.from({ length: 10 }, (_, i) => {
								const year = new Date().getFullYear() + i - 1;
								return <option value={year}>{year}</option>;
							})}
						</select>
					</div>
				</div>
			</div>
			<div class="block">
				<label for="time">Interview Time:</label>
				<div class="grid grid-cols-3 gap-2 mt-2">
					<div class="flex flex-col">
						<select
							id="interview_hour"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().time?.split(":")[0]}
							required
							onInput={(e) => {
								const [_, minutes] = data().time.split(":");
								const [min, am_pm] = minutes.split(" ");
								setData({
									...data(),
									time: `${e.target.value}:${min} ${am_pm}`,
								});
							}}
						>
							{Array.from({ length: 12 }, (_, i) => {
								const hour = (i + 1).toString().padStart(2, "0");
								return <option value={hour}>{hour}</option>;
							})}
						</select>
					</div>
					<div class="flex flex-col">
						<select
							id="interview_minute"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().time?.split(":")[1].split(" ")[0]}
							required
							onInput={(e) => {
								const [hours, minutes] = data().time.split(":");
								const [_, am_pm] = minutes.split(" ");
								setData({
									...data(),
									time: `${hours}:${e.target.value} ${am_pm}`,
								});
							}}
						>
							{Array.from({ length: 60 }, (_, i) => {
								const minute = i.toString().padStart(2, "0");
								return <option value={minute}>{minute}</option>;
							})}
						</select>
					</div>
					<div class="flex flex-col">
						<select
							id="interview_ampm"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().time?.split(":")[1].split(" ")[1]}
							required
							onInput={(e) => {
								const [hours, minutes] = data().time.split(":");
								const [min, _] = minutes.split(" ");
								setData({
									...data(),
									time: `${hours}:${min} ${e.target.value}`,
								});
							}}
						>
							<option value="AM">AM</option>
							<option value="PM">PM</option>
						</select>
					</div>
				</div>
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
