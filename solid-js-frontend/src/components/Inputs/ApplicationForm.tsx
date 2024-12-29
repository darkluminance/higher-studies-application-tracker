import { createEffect, createSignal, For, onMount } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../../utils";
import { setUserData } from "../../stores/UserStore";
import toast from "solid-toast";
import LoadingButton from "../LoadingButton";
import { Applications } from "../../models/Application";
import { Faculties } from "../../models/Faculty";
import { Universities } from "../../models/University";
import RemoveIcon from "../Icons/RemoveIcon";
import { Recommenders } from "../../models/Recommender";

export default function ApplicationForm(
	props: { editData: Applications; fallback: Function } | null
) {
	const [data, setData] = createSignal<Applications>({} as Applications);
	const [faculties, setFaculties] = createSignal<Faculties[]>([]);
	const [universities, setUniversities] = createSignal<Universities[]>([]);
	const [recommenders, setRecommenders] = createSignal<Recommenders[]>([]);
	const [lorCount, setLorCount] = createSignal(0);
	const [applicationTypeEnumValues, setApplicationTypeEnumValues] =
		createSignal<string[]>([]);
	const [applicationStatusEnumValues, setApplicationStatusEnumValues] =
		createSignal<string[]>([]);
	const [loading, setIsLoading] = createSignal(false);

	const resetForm = () => {
		const settingData: Applications = {
			id: "",
			university_id: "",
			application_type: "PHD",
			shortlisted_faculties_id: [],
			recommenders_id: [],
			application_status: "NOT APPLIED",
			language_score_submitted: false,
			remarks: "",
			gre_submitted: false,
			gmat_submitted: false,
		};
		setData(settingData);
	};

	const fetchUniversities = async () => {
		try {
			const data = await getAuthenticatedData("/university/user/get");
			setUniversities(data);
		} catch (error) {
			console.error("Error fetching universities:", error);
		}
	};

	const fetchRecommenders = async () => {
		try {
			const data = await getAuthenticatedData("/recommenders/user/get");
			setRecommenders(data);
		} catch (error) {
			console.error("Error fetching recommenders:", error);
		}
	};

	const fetchFaculties = async () => {
		setFaculties([]);

		try {
			const res = (await postAuthenticatedData(
				`/faculties/user/university/get`,
				{ university_id: data().university_id }
			)) as Faculties[];
			setFaculties(res);
		} catch (error) {
			console.error("Error fetching faculties:", error);
		}
	};

	const fetchApplicationStatusEnums = async () => {
		let enums = await getAuthenticatedData(
			"/enums?enum_name=university_application_status_enum"
		);

		if (enums) {
			setApplicationStatusEnumValues(enums);
		}
	};

	const fetchApplicationTypeEnums = async () => {
		let enums = await getAuthenticatedData(
			"/enums?enum_name=application_type_enum"
		);

		if (enums) {
			setApplicationTypeEnumValues(enums);
		}
	};

	createEffect(() => {
		if (props?.editData) {
			setData(props.editData);
		}
	});

	onMount(() => {
		fetchApplicationStatusEnums();
		fetchApplicationTypeEnums();
		fetchUniversities();
		fetchRecommenders();
		if (!props?.editData) resetForm();
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const { id, ...payload } = data();

		// Check for duplicated items
		const uniqueRecommenders = [...new Set(payload.recommenders_id)];
		if (uniqueRecommenders.length < payload.recommenders_id.length) {
			toast.error("Duplicated recommenders are not allowed");
			return;
		}
		const uniqueFaculties = [...new Set(payload.shortlisted_faculties_id)];
		if (uniqueFaculties.length < payload.shortlisted_faculties_id.length) {
			toast.error("Duplicated Faculties are not allowed");
			return;
		}

		// remove empty string items from data().recommenders_id and data().shortlisted_faculties
		payload.recommenders_id = payload.recommenders_id.filter(
			(recommender) => recommender !== ""
		);
		payload.shortlisted_faculties_id = payload.shortlisted_faculties_id.filter(
			(faculty) => faculty !== ""
		);

		let res;
		setIsLoading(true);

		if (!props?.editData)
			res = await postAuthenticatedData("/applications/create", payload);
		else
			res = await postAuthenticatedData("/applications/update", {
				...payload,
				updated_at: new Date().toISOString(),
				id: id,
			});

		setIsLoading(false);

		if (res) {
			setUserData("isFirstTime", false);
			localStorage.setItem("isFirstTime", JSON.stringify(false));
			toast.success("Successfully created application");
		} else {
			toast.error("Could not create application");
		}

		props?.fallback();
	};

	return (
		<form class="space-y-5" onSubmit={handleSubmit}>
			<div class="block">
				<label for="university">University:</label>
				<div class="flex gap-4">
					<select
						id={`university-${data().id}`}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						value={data().university_id}
						onChange={(e) => {
							setData({
								...data(),
								university_id: e.target.value,
								shortlisted_faculties_id: [],
								recommenders_id: [],
							});
							setLorCount(0);

							if (e.target.value === "") return;

							fetchFaculties();

							const lorCount = universities().find(
								(uni) => uni.id === e.target.value
							)?.lor_count;
							if (lorCount) setLorCount(lorCount);
						}}
					>
						<option value="">Select a university</option>
						{universities().map((uni) => (
							<option value={uni.id} selected={data().university_id === uni.id}>
								{uni.name}
							</option>
						))}
					</select>
				</div>
			</div>
			<div class="block">
				<label for="application_type">Application Type:</label>
				<select
					id="application_type"
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					value={data().application_type}
					onChange={(e) =>
						setData({ ...data(), application_type: e.target.value })
					}
				>
					<For each={applicationTypeEnumValues()}>
						{(value) => <option value={value}>{value}</option>}
					</For>
				</select>
			</div>
			<div class="block">
				<div class="grid grid-cols-2">
					<label>Shortlisted Faculties:</label>
					<button
						type="button"
						class="text-right text-cyan-400 hover:text-cyan-300"
						onClick={() => {
							setData({
								...data(),
								shortlisted_faculties_id: [
									...data().shortlisted_faculties_id,
									"",
								],
							});
						}}
					>
						Add Faculty
					</button>
				</div>
				{data().shortlisted_faculties_id?.map((_, index) => (
					<div class="flex gap-4 mt-2">
						<select
							class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							value={data().shortlisted_faculties_id[index]}
							onChange={(e) => {
								const newFaculties = [...data().shortlisted_faculties_id];
								newFaculties[index] = e.target.value;
								setData({ ...data(), shortlisted_faculties_id: newFaculties });
							}}
						>
							<option value="">Select a faculty</option>
							{faculties().map((faculty) => (
								<option value={faculty.id}>{faculty.name}</option>
							))}
						</select>
						<button
							type="button"
							class="hover:opacity-50"
							onClick={() => {
								const newFaculties = data().shortlisted_faculties_id.filter(
									(_, i) => i !== index
								);
								setData({ ...data(), shortlisted_faculties_id: newFaculties });
							}}
						>
							<RemoveIcon width="24px"></RemoveIcon>
						</button>
					</div>
				))}
			</div>
			<div class="block">
				<label>Recommenders:</label>
				<For each={Array(lorCount()).fill(0)}>
					{(_, index) => (
						<div class="flex gap-4 mt-2">
							<select
								class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
								value={data().recommenders_id[index()]}
								onChange={(e) => {
									const newFaculties = [...data().recommenders_id];
									newFaculties[index()] = e.target.value;
									setData({
										...data(),
										recommenders_id: newFaculties,
									});
								}}
							>
								{recommenders().map((recommender) => (
									<option value={recommender.id}>{recommender.name}</option>
								))}
							</select>
						</div>
					)}
				</For>
			</div>
			<div class="block">
				<label for="application_status">Application Status:</label>
				<select
					id="application_status"
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					value={data().application_status}
					onChange={(e) =>
						setData({ ...data(), application_status: e.target.value })
					}
				>
					<For each={applicationStatusEnumValues()}>
						{(value) => <option value={value}>{value}</option>}
					</For>
				</select>
			</div>
			<div class="block">
				Score submissions:
				<div class="block grid grid-cols-3 gap-4">
					<div>
						<label for="language_score_submitted">Language:</label>
						<input
							type="checkbox"
							id="language_score_submitted"
							checked={
								data().language_score_submitted === "YES" ||
								Boolean(data().language_score_submitted)
							}
							class="ml-2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							onInput={(e) =>
								setData({
									...data(),
									language_score_submitted: e.target.checked,
								})
							}
						/>
					</div>
					<div>
						<label for="gre_submitted">GRE:</label>
						<input
							type="checkbox"
							id="gre_submitted"
							checked={
								data().gre_submitted === "YES" || Boolean(data().gre_submitted)
							}
							class="ml-2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							onInput={(e) =>
								setData({ ...data(), gre_submitted: e.target.checked })
							}
						/>
					</div>
					<div>
						<label for="gmat_submitted">GMAT:</label>
						<input
							type="checkbox"
							id="gmat_submitted"
							checked={
								data().gmat_submitted === "YES" ||
								Boolean(data().gmat_submitted)
							}
							class="ml-2 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
							onInput={(e) =>
								setData({ ...data(), gmat_submitted: e.target.checked })
							}
						/>
					</div>
				</div>
			</div>
			<div class="block">
				<textarea
					id="remarks"
					placeholder="Remarks"
					value={data().remarks}
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) => setData({ ...data(), remarks: e.target.value })}
				/>
			</div>
			<LoadingButton loading={loading()} text="Submit" />
		</form>
	);
}
