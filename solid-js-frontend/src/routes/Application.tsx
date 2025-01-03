import { createSignal, onMount } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import { Applications } from "../models/Application";
import DashboardBase from "../components/DashboardBase";
import toast from "solid-toast";
import ApplicationForm from "../components/Inputs/ApplicationForm";
import BaseAllEntries from "../components/BaseAllEntries";
import { Faculties } from "../models/Faculty";
import { Universities } from "../models/University";
import { Recommenders } from "../models/Recommender";

export default function Application() {
	return <DashboardBase component={ApplicationComponent} />;
}

function ApplicationComponent() {
	const [applications, setApplications] = createSignal<Applications[]>();
	const [faculties, setFaculties] = createSignal<Faculties[]>();
	const [universities, setUniversities] = createSignal<Universities[]>();
	const [recommenders, setRecommenders] = createSignal<Recommenders[]>();

	const fetchApplicationLists = async () => {
		setApplications();

		const applications = (await getAuthenticatedData(
			"/applications/user/get"
		)) as Applications[];

		if (applications) {
			setApplications(applications);
		}

		return applications;
	};

	const fetchFaculties = async () => {
		try {
			const data = await getAuthenticatedData("/faculties/user/get");
			setFaculties(data);
		} catch (error) {
			console.error("Error fetching faculties:", error);
		}
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

	const handleDeleteApplication = (id: string) => {
		const res = postAuthenticatedData("/applications/delete", {
			id: id,
		});

		toast
			.promise(res, {
				loading: "Deleting data...",
				success: (val) => <span>Deleted data</span>,
				error: <span>Could not delete data</span>,
			})
			.then(() => {
				fetchApplicationLists();
			});
	};

	const handleEditFormatter = (item: Applications) => {
		item.language_score_submitted = item.language_score_submitted === "YES";
		item.gre_submitted = item.gre_submitted === "YES";
		item.gmat_submitted = item.gmat_submitted === "YES";
		return item;
	};

	onMount(() => {
		fetchFaculties();
		fetchUniversities();
		fetchRecommenders();
		fetchApplicationLists();
	});

	return (
		<>
			<BaseAllEntries
				title="Applications"
				data={applications()}
				handleDelete={handleDeleteApplication}
				editFormatter={handleEditFormatter}
				universityList={universities()}
				recommenderList={recommenders()}
				facultyList={faculties()}
				formComponent={ApplicationForm}
				fetchData={fetchApplicationLists}
			/>
		</>
	);
}
