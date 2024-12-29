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
			application_deadline: "",
			early_deadline: "",
			is_gre_must: false,
			is_gmat_must: false,
			lor_count: 0,
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
			toast.success("Successfully created university");
		} else {
			toast.error("Could not create university");
		}

		props?.fallback();
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
						id="subject_ranking"
						value={data().subject_ranking as number}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({ ...data(), subject_ranking: Number(e.target.value) })
						}
					/>
				</div>
			</div>
			<div class="block grid grid-cols-2 gap-4">
				<div>
					<label for="application_deadline">Application Deadline:</label>
					<input
						type="string"
						placeholder="YYYY-MM-DD"
						id="application_deadline"
						required
						value={data().application_deadline}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({
								...data(),
								application_deadline: e.target.value,
							})
						}
					/>
				</div>
				<div>
					<label for="early_deadline">Priority Deadline:</label>
					<input
						type="string"
						placeholder="YYYY-MM-DD"
						id="early_deadline"
						required
						value={data().early_deadline}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({
								...data(),
								early_deadline: e.target.value,
							})
						}
					/>
				</div>
			</div>
			<div class="block">
				<label for="lor_count">LOR count:</label>
				<input
					type="number"
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
