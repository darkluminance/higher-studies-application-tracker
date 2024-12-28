import { createSignal, onMount, Show } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import { Applications } from "../models/Application";
import DashboardBase from "../components/DashboardBase";
import DynamicTable from "../components/DynamicTable";
import ItemInputBase from "../components/ItemInputBase";
import toast from "solid-toast";
import ApplicationForm from "../components/Inputs/ApplicationForm";
import BaseAllEntries from "../components/BaseAllEntries";

export default function Application() {
	return <DashboardBase component={ApplicationComponent} />;
}

function ApplicationComponent() {
	const [applications, setApplications] = createSignal<Applications[]>();

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

	onMount(() => {
		toast.promise(fetchApplicationLists(), {
			loading: "Fetching data...",
			success: (val) => <span>Fetched data</span>,
			error: <span>Could not fetch data</span>,
		});
	});

	return (
		<>
			<BaseAllEntries
				title="Faculties"
				data={applications()}
				handleDelete={handleDeleteApplication}
				formComponent={ApplicationForm}
				fetchData={fetchApplicationLists}
			/>
		</>
	);
}
