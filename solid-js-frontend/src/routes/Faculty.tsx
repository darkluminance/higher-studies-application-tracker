import { createEffect, createSignal, onMount } from "solid-js";
import DashboardBase from "../components/DashboardBase";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import toast from "solid-toast";
import { Faculties } from "../models/Faculty";
import BaseAllEntries from "../components/BaseAllEntries";
import FacultyForm from "../components/Inputs/FacultyForm";
import { Universities } from "../models/University";

export default function Faculty() {
	return <DashboardBase component={FacultyComponent} />;
}

function FacultyComponent() {
	const [faculties, setFaculties] = createSignal<Faculties[]>();
	const [universities, setUniversities] = createSignal<Universities[]>([]);
	const [filterID, setFilterID] = createSignal<string>();

	const handleChangeFilter = (val: { university_id: string } | null) => {
		setFilterID(val?.university_id);
		fetchFacultyLists(val);
	};

	const fetchFacultyLists = async (
		val: { university_id: string } | null = null
	) => {
		setFaculties();
		let faculties;

		if (!val) {
			faculties = (await getAuthenticatedData(
				"/faculties/user/get"
			)) as Faculties[];
		} else {
			faculties = (await postAuthenticatedData(
				`/faculties/user/university/get`,
				val
			)) as Faculties[];
		}

		if (faculties) {
			setFaculties(faculties);
		}
	};

	const fetchUniversities = async () => {
		const unis = (await getAuthenticatedData(
			"/university/user/get"
		)) as Universities[];

		if (unis) {
			setUniversities(unis);
		}
	};

	const handleDeleteFaculty = (id: string) => {
		const res = postAuthenticatedData("/faculties/delete", {
			id: id,
		});

		toast
			.promise(res, {
				loading: "Deleting data...",
				success: (val) => <span>Deleted data</span>,
				error: <span>Could not delete data</span>,
			})
			.then(() => {
				fetchFacultyLists();
			});
	};

	onMount(() => {
		fetchUniversities();
	});

	return (
		<BaseAllEntries
			title="Faculties"
			data={faculties()}
			handleDelete={handleDeleteFaculty}
			formComponent={FacultyForm}
			fetchData={fetchFacultyLists}
			universityList={universities()}
			filterList={universities()}
			filterByTitle={"Show Universities"}
			filterKey={"university_id"}
			filterID={filterID()}
			handleFilterChange={handleChangeFilter}
		/>
	);
}
