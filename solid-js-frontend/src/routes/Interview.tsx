import { createEffect, createSignal, onMount } from "solid-js";
import DashboardBase from "../components/DashboardBase";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import toast from "solid-toast";
import BaseAllEntries from "../components/BaseAllEntries";
import { Interviews } from "../models/Interview";
import { Faculties } from "../models/Faculty";
import InterviewForm from "../components/Inputs/InterviewForm";

export default function Interview() {
	return <DashboardBase component={InterviewComponent} />;
}

function InterviewComponent() {
	const [interviews, setInterviews] = createSignal<Interviews[]>();
	const [faculties, setFaculties] = createSignal<Faculties[]>([]);
	const [filterID, setFilterID] = createSignal<string>();

	const handleChangeFilter = (val: { faculty_id: string } | null) => {
		setFilterID(val?.faculty_id);
		fetchInterviewLists(val);
	};

	const fetchInterviewLists = async (
		val: { faculty_id: string } | null = null
	) => {
		setInterviews();
		let interviews;

		if (!val) {
			interviews = (await getAuthenticatedData(
				"/interviews/user/get"
			)) as Interviews[];
		} else {
			interviews = (await postAuthenticatedData(
				`/interviews/user/faculty/get`,
				val
			)) as Interviews[];
		}

		if (interviews) {
			setInterviews(interviews);
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

	const handleDeleteInterview = (id: string) => {
		const res = postAuthenticatedData("/interviews/delete", {
			id: id,
		});

		toast
			.promise(res, {
				loading: "Deleting data...",
				success: (val) => <span>Deleted data</span>,
				error: <span>Could not delete data</span>,
			})
			.then(() => {
				fetchFaculties();
			});
	};

	const handleEditFormatter = (item: Interviews) => {
		item.is_completed = item.is_completed === "YES";
		item.date = new Date(item.date).toISOString().split("T")[0];
		return item;
	};

	onMount(() => {
		fetchFaculties();
	});

	return (
		<BaseAllEntries
			title="Interviews"
			data={interviews()}
			handleDelete={handleDeleteInterview}
			editFormatter={handleEditFormatter}
			formComponent={InterviewForm}
			fetchData={fetchInterviewLists}
			filterList={faculties()}
			facultyList={faculties()}
			filterByTitle={"Show Faculties"}
			filterKey={"faculty_id"}
			filterID={filterID()}
			handleFilterChange={handleChangeFilter}
		/>
	);
}
