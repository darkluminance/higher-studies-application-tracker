import { createEffect, createSignal, onMount, Show } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import DashboardBase from "../components/DashboardBase";
import DynamicTable from "../components/DynamicTable";
import { Recommenders } from "../models/Recommender";
import toast from "solid-toast";
import ItemInputBase from "../components/ItemInputBase";
import RecommenderForm from "../components/Inputs/RecommenderForm";

export default function Recommender() {
	return <DashboardBase component={RecommenderComponent} />;
}

function RecommenderComponent() {
	const [recommenders, setRecommenders] = createSignal<Recommenders[]>();
	const [showItemInputter, setShowItemInputter] = createSignal(false);
	const [editData, setEditData] = createSignal();

	const fetchRecommenders = async () => {
		setRecommenders();

		const recommenders = (await getAuthenticatedData(
			"/recommenders/user/get"
		)) as Recommenders[];

		if (recommenders) {
			setRecommenders(recommenders);
		}

		return recommenders;
	};
	const handleDeleteRecommender = (id: string) => {
		const res = postAuthenticatedData("/recommenders/delete", {
			id: id,
		});

		toast
			.promise(res, {
				loading: "Deleting data...",
				success: (val) => <span>Deleted data</span>,
				error: <span>Could not delete data</span>,
			})
			.then(() => {
				fetchRecommenders();
			});
	};

	const handleCompleteSubmit = () => {
		setShowItemInputter(false);
		fetchRecommenders();
	};

	onMount(() => {
		toast.promise(fetchRecommenders(), {
			loading: "Fetching data...",
			success: (val) => <span>Fetched data</span>,
			error: <span>Could not fetch data</span>,
		});
	});

	return (
		<>
			<div class="px-8 py-4">
				<div class=" flex justify-between">
					<h1 class="text-xl">Recommenders </h1>
					<button
						class="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 focus:outline-none"
						onClick={() => {
							setShowItemInputter(true);
							setEditData();
						}}
					>
						Add +
					</button>
				</div>
				<Show when={recommenders()}>
					<DynamicTable
						data={recommenders()}
						setEditData={(val: Recommenders) => {
							setEditData(val);
							setShowItemInputter(true);
						}}
						deleteFunction={handleDeleteRecommender}
					></DynamicTable>
				</Show>
			</div>
			<Show when={showItemInputter()}>
				<ItemInputBase
					closeFunction={() => {
						setShowItemInputter(false);
						setEditData();
					}}
					component={RecommenderForm}
					editData={editData()}
					fallback={handleCompleteSubmit}
				></ItemInputBase>
			</Show>
		</>
	);
}
