import { createSignal, onMount } from "solid-js";
import DashboardBase from "../components/DashboardBase";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import toast from "solid-toast";
import BaseAllEntries from "../components/BaseAllEntries";
import { Mails } from "../models/Mail";
import { Universities } from "../models/University";
import MailForm from "../components/Inputs/MailForm";
import { Faculties } from "../models/Faculty";

export default function Mail() {
	return <DashboardBase component={MailComponent} />;
}

function MailComponent() {
	const [mails, setMails] = createSignal<Mails[]>();
	const [faculties, setFaculties] = createSignal<Faculties[]>([]);

	const fetchMailLists = async () => {
		setMails();
		const mails = (await getAuthenticatedData("/mails/user/get")) as Mails[];

		if (mails) {
			setMails(mails);
		}
	};

	const fetchFaculties = async () => {
		let faculties = (await getAuthenticatedData(
			"/faculties/user/get"
		)) as Faculties[];

		if (faculties) {
			faculties.forEach(async (faculty) => {
				const facultyUniversity = await postAuthenticatedData(
					"/university/get",
					{
						id: faculty.university_id,
					}
				);
				faculty.name += ` (${facultyUniversity.name})`;
				setFaculties(faculties);
			});
		}
	};

	const handleDeleteMail = (id: string) => {
		const res = postAuthenticatedData("/mails/delete", {
			id: id,
		});

		toast
			.promise(res, {
				loading: "Deleting data...",
				success: (val) => <span>Deleted data</span>,
				error: <span>Could not delete data</span>,
			})
			.then(() => {
				fetchMailLists();
			});
	};

	const handleEditFormatter = (item: Mails) => {
		item.is_mailed = item.is_mailed === "YES";
		item.is_mail_replied = item.is_mail_replied === "YES";
		item.is_interview_requested = item.is_interview_requested === "YES";
		return item;
	};

	onMount(() => {
		fetchFaculties();
	});

	return (
		<BaseAllEntries
			title="Mails"
			data={mails()}
			handleDelete={handleDeleteMail}
			editFormatter={handleEditFormatter}
			formComponent={MailForm}
			fetchData={fetchMailLists}
			facultyList={faculties()}
			filterByTitle={"Show Universities"}
		/>
	);
}
