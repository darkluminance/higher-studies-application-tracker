import { createEffect, createSignal, onMount } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../../utils";
import { setUserData } from "../../stores/UserStore";
import toast from "solid-toast";
import LoadingButton from "../LoadingButton";
import { Universities } from "../../models/University";

export default function UniversityForm(
	props: { editData: Universities; fallback: Function } | null
) {
	const [data, setData] = createSignal<Universities>({} as Universities);
	const [loading, setIsLoading] = createSignal(false);

	const resetForm = () => {
		const settingData = {
			id: "",
			name: "",
			website: "",
			location: "",
			main_ranking: 0,
			subject_ranking: 0,
			application_fee: 0,
			application_deadline: new Date().toISOString().split("T")[0],
			early_deadline: new Date().toISOString().split("T")[0],
			is_gre_must: false,
			is_gmat_must: false,
			lor_count: 1,
			is_official_transcript_required: false,
			is_transcript_needs_evaluation: false,
			remarks: "",
			accepted_evaluations: [],
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
		const { id, ...payload } = data();
		try {
			payload.application_deadline = new Date(
				payload.application_deadline
			).toISOString();
			payload.early_deadline = new Date(payload.early_deadline).toISOString();
		} catch (error) {
			toast.error("Please enter valid date format");
			return;
		}

		let res;
		setIsLoading(true);

		if (!props?.editData)
			res = await postAuthenticatedData("/university/create", payload);
		else
			res = await postAuthenticatedData("/university/update", {
				...payload,
				updated_at: new Date().toISOString(),
				id: id,
			});

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
				<label for="website">Website:</label>
				<input
					type="text"
					id="website"
					value={data().website}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), website: e.target.value })}
				/>
			</div>
			<div class="block">
				<label for="location">Location:</label>
				<input
					type="text"
					id="location"
					value={data().location}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), location: e.target.value })}
				/>
			</div>
			<div class="block grid grid-cols-2 gap-4">
				<div>
					<label for="main_ranking">Ranking:</label>
					<input
						type="number"
						min="0"
						id="main_ranking"
						value={data().main_ranking as number}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({ ...data(), main_ranking: Number(e.target.value) })
						}
					/>
				</div>

				<div>
					<label for="subject_ranking">Subject Ranking:</label>
					<input
						type="number"
						min="0"
						id="subject_ranking"
						value={data().subject_ranking as number}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({ ...data(), subject_ranking: Number(e.target.value) })
						}
					/>
				</div>
			</div>
			<div class="block">
				<label for="application_fee">Application Fee:</label>
				<input
					type="number"
					min="0"
					id="application_fee"
					value={data().application_fee as number}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({ ...data(), application_fee: Number(e.target.value) })
					}
				/>
			</div>
			<div class="block">
				<label for="early_deadline">Priority Deadline:</label>
				<div class="grid grid-cols-3 gap-2 mt-2">
					<div class="flex flex-col">
						<select
							id="early_day"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().early_deadline?.split("-")[2] || ""}
							required
							onInput={(e) => {
								const [year, month] = data().early_deadline?.split("-") || [
									"",
									"",
								];
								setData({
									...data(),
									early_deadline: `${year || new Date().getFullYear()}-${
										month || "01"
									}-${e.target.value}`,
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
							id="early_month"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().early_deadline?.split("-")[1] || ""}
							required
							onInput={(e) => {
								const [year, _, day] = data().early_deadline?.split("-") || [
									"",
									"",
									"",
								];
								setData({
									...data(),
									early_deadline: `${year || new Date().getFullYear()}-${
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
							id="early_year"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().early_deadline?.split("-")[0] || ""}
							required
							onInput={(e) => {
								const [_, month, day] = data().early_deadline?.split("-") || [
									"",
									"",
									"",
								];
								setData({
									...data(),
									early_deadline: `${e.target.value}-${month || "01"}-${
										day || "01"
									}`,
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
				<label for="application_deadline">Application Deadline:</label>
				<div class="grid grid-cols-3 gap-2 mt-2">
					<div class="flex flex-col">
						<select
							id="app_day"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().application_deadline?.split("-")[2] || ""}
							required
							onInput={(e) => {
								const [year, month] = data().application_deadline?.split(
									"-"
								) || ["", ""];
								setData({
									...data(),
									application_deadline: `${year || new Date().getFullYear()}-${
										month || "01"
									}-${e.target.value}`,
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
							id="app_month"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().application_deadline?.split("-")[1] || ""}
							required
							onInput={(e) => {
								const [year, _, day] = data().application_deadline?.split(
									"-"
								) || ["", "", ""];
								setData({
									...data(),
									application_deadline: `${year || new Date().getFullYear()}-${
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
							id="app_year"
							class="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().application_deadline?.split("-")[0] || ""}
							required
							onInput={(e) => {
								const [_, month, day] = data().application_deadline?.split(
									"-"
								) || ["", "", ""];
								setData({
									...data(),
									application_deadline: `${e.target.value}-${month || "01"}-${
										day || "01"
									}`,
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
				<label for="lor_count">LOR count:</label>
				<input
					type="number"
					min="1"
					id="lor_count"
					value={data().lor_count}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({ ...data(), lor_count: Number(e.target.value) })
					}
				/>
			</div>
			<div class="block grid grid-cols-2">
				<div>
					<label for="is_gre_must">GRE Required:</label>
					<input
						type="checkbox"
						id="is_gre_must"
						checked={
							data().is_gre_must === "YES" || Boolean(data().is_gre_must)
						}
						class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({ ...data(), is_gre_must: e.target.checked })
						}
					/>
				</div>

				<div>
					<label for="is_gmat_must">GMAT Required:</label>
					<input
						type="checkbox"
						id="is_gmat_must"
						checked={
							data().is_gmat_must === "YES" || Boolean(data().is_gmat_must)
						}
						class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({ ...data(), is_gmat_must: e.target.checked })
						}
					/>
				</div>
			</div>
			<div class="block grid grid-cols-2">
				<div>
					<label for="is_official_transcript_required">
						Official Transcript Required:
					</label>
					<input
						type="checkbox"
						id="is_official_transcript_required"
						checked={
							data().is_official_transcript_required === "YES" ||
							Boolean(data().is_official_transcript_required)
						}
						class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({
								...data(),
								is_official_transcript_required: e.target.checked,
							})
						}
					/>
				</div>

				<div>
					<label for="is_transcript_needs_evaluation">
						Transcript Needs Evaluation:
					</label>
					<input
						type="checkbox"
						id="is_transcript_needs_evaluation"
						checked={
							data().is_transcript_needs_evaluation === "YES" ||
							Boolean(data().is_transcript_needs_evaluation)
						}
						class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({
								...data(),
								is_transcript_needs_evaluation: e.target.checked,
							})
						}
					/>
				</div>
			</div>
			<div class="block">
				<label for="accepted_evaluations">
					Accepted Evaluations (Ex- WES, ECE):
				</label>
				<input
					type="text"
					id="accepted_evaluations"
					value={data().accepted_evaluations}
					placeholder="Comma separated values"
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({
							...data(),
							accepted_evaluations: e.target.value.replace(" ", "").split(","),
						})
					}
				/>
			</div>
			<div class="block">
				<textarea
					id="remarks"
					placeholder="Remarks"
					value={data().remarks}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					rows="2"
					onInput={(e) => setData({ ...data(), remarks: e.target.value })}
				/>
			</div>
			<LoadingButton loading={loading()} text="Submit" />
		</form>
	);
}
