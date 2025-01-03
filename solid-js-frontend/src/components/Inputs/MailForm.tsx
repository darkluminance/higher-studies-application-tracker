import { createEffect, createSignal, onMount } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../../utils";
import toast from "solid-toast";
import { setUserData } from "../../stores/UserStore";
import LoadingButton from "../LoadingButton";
import { Mails } from "../../models/Mail";

export default function MailForm(
	props: {
		editData: Mails;
		fallback: Function;
		reply_vibe_enum: string[];
	} | null
) {
	const [data, setData] = createSignal<Mails>({} as Mails);
	const [faculties, setFaculties] = createSignal([]);
	const [enumValues, setEnumValues] = createSignal<string[]>([]);
	const [loading, setIsLoading] = createSignal(false);

	const fetchFaculties = async () => {
		try {
			const data = await getAuthenticatedData("/faculties/user/get");
			setFaculties(data);
		} catch (error) {
			console.error("Error fetching faculties:", error);
		}
	};

	const fetchEnums = async () => {
		let enums = await getAuthenticatedData("/enums?enum_name=reply_vibe_enum");

		if (enums) {
			setEnumValues(enums);
		}
	};

	const resetForm = () => {
		const settingData = {
			id: "",
			faculty_id: "",
			faculty_name: "",
			is_mailed: false,
			is_mail_replied: false,
			reply_vibe: "",
			remarks: "",
			is_interview_requested: false,
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
		fetchEnums();
		if (!props?.editData) resetForm();
	});

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const { id, ...filtered } = data();

		if (!filtered.faculty_id) {
			toast.error("Please select a faculty");
			return;
		}

		setIsLoading(true);

		const payload = props?.editData ? { ...filtered, id: id } : filtered;
		const url = props?.editData ? "/mails/update" : "/mails/create";
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
						{faculties().map((uni: { id: string; name: string }) => (
							<option value={uni.id} selected={data().faculty_id === uni.id}>
								{uni.name}
							</option>
						))}
					</select>
				</div>
			</div>
			<div class="block grid grid-cols-2 gap-4">
				<div>
					<label for="is_mailed">Mailed:</label>
					<input
						type="checkbox"
						id="is_mailed"
						checked={data().is_mailed === "YES" || Boolean(data().is_mailed)}
						class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) => setData({ ...data(), is_mailed: e.target.checked })}
					/>
				</div>
				<div>
					<label for="is_mail_replied">Mail replied:</label>
					<input
						type="checkbox"
						id="is_mail_replied"
						checked={
							data().is_mail_replied === "YES" ||
							Boolean(data().is_mail_replied)
						}
						class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						onInput={(e) =>
							setData({ ...data(), is_mail_replied: e.target.checked })
						}
					/>
				</div>
			</div>
			<div class="block">
				<label for="is_interview_requested">Interview Requested:</label>
				<input
					type="checkbox"
					id="is_interview_requested"
					checked={
						data().is_interview_requested === "YES" ||
						Boolean(data().is_interview_requested)
					}
					class="ml-4 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
					onInput={(e) =>
						setData({ ...data(), is_interview_requested: e.target.checked })
					}
				/>
			</div>
			<div class="block">
				<label for="reply_vibe">Reply Vibe:</label>
				<div class="flex gap-4">
					<select
						id={`reply_vibe-${data().id}`}
						class="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
						value={data().reply_vibe}
						onChange={(e) => setData({ ...data(), reply_vibe: e.target.value })}
					>
						<option value="">Select the reply vibe</option>
						{enumValues().map((vibe: string) => (
							<option value={vibe} selected={data().reply_vibe === vibe}>
								{vibe}
							</option>
						))}
					</select>
				</div>
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
