import { createSignal, onMount, Show } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import { Universities } from "../models/University";
import DashboardBase from "../components/DashboardBase";
import DynamicTable from "../components/DynamicTable";
import ItemInputBase from "../components/ItemInputBase";
import UniversityForm from "../components/Inputs/UniversityForm";
import toast from "solid-toast";

export default function University() {
	return <DashboardBase component={UniversityComponent} />;
}

function UniversityComponent() {
	const [universities, setUniversities] = createSignal<Universities[]>();
	const [showItemInputter, setShowItemInputter] = createSignal(false);
	const [editData, setEditData] = createSignal();

	const fetchUniversityLists = async () => {
		setUniversities();

		const universities = (await getAuthenticatedData(
			"/university/user/get"
		)) as Universities[];

		if (universities) {
			setUniversities(universities);
		}

		return universities;
	};

	const handleDeleteUniversity = (id: string) => {
		const res = postAuthenticatedData("/university/delete", {
			id: id,
		});

		toast
			.promise(res, {
				loading: "Deleting data...",
				success: (val) => <span>Deleted data</span>,
				error: <span>Could not delete data</span>,
			})
			.then(() => {
				fetchUniversityLists();
			});
	};

	const handleCompleteSubmit = () => {
		setShowItemInputter(false);
		fetchUniversityLists();
	};

	onMount(() => {
		toast.promise(fetchUniversityLists(), {
			loading: "Fetching data...",
			success: (val) => <span>Fetched data</span>,
			error: <span>Could not fetch data</span>,
		});
	});

	return (
		<>
			<div class="px-8 py-4">
				<div class=" flex justify-between">
					<h1 class="text-xl">Universities </h1>
					<button
						class="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none"
						onClick={() => setShowItemInputter(true)}
					>
						Add +
					</button>
				</div>
				<Show when={universities()}>
					<DynamicTable
						data={universities()}
						setEditData={(val: Universities) => {
							val.application_deadline = new Date(val.application_deadline)
								.toISOString()
								.split("T")[0];
							val.early_deadline = new Date(val.early_deadline)
								.toISOString()
								.split("T")[0];

							const { created_at, updated_at, ...item } = val;

							item.is_gmat_must = item.is_gmat_must === "YES";
							item.is_gre_must = item.is_gre_must === "YES";
							item.is_official_transcript_required =
								item.is_official_transcript_required === "YES";
							item.is_transcript_needs_evaluation =
								item.is_transcript_needs_evaluation === "YES";

							setEditData(item);
							setShowItemInputter(true);
						}}
						deleteFunction={handleDeleteUniversity}
					></DynamicTable>
				</Show>
			</div>

			<Show when={showItemInputter()}>
				<ItemInputBase
					closeFunction={() => {
						setShowItemInputter(false);
						setEditData();
					}}
					component={UniversityForm}
					editData={editData()}
					fallback={handleCompleteSubmit}
				></ItemInputBase>
			</Show>
		</>
	);
}
