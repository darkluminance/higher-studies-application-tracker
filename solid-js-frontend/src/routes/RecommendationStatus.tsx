import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { getAuthenticatedData, postAuthenticatedData } from "../utils";
import DashboardBase from "../components/DashboardBase";
import toast from "solid-toast";
import RecommenderForm from "../components/Inputs/RecommenderForm";
import BaseAllEntries from "../components/BaseAllEntries";
import { useParams } from "@solidjs/router";
import { RecommendersStatus } from "../models/RecommendationStatus";

export default function RecommendationStatus() {
	return <DashboardBase component={RecommendationStatusComponent} />;
}

function RecommendationStatusComponent() {
	const [recommenders, setRecommenders] = createSignal<RecommendersStatus[]>();
	const [universityname, setUniversityName] = createSignal("");
	const params = useParams();

	const fetchRecommenders = async () => {
		setRecommenders();

		const recommenders = (await postAuthenticatedData(
			"/recommendation_status/university/get",
			{ application_id: params.university_id }
		)) as RecommendersStatus[];

		if (recommenders) {
			setRecommenders(recommenders);
			fetchUniversityName();
		}

		return recommenders;
	};

	const fetchUniversityName = async () => {
		const res = await postAuthenticatedData(
			"/recommendation_status/university/name/get",
			{ application_id: params.university_id }
		);

		if (res) {
			setUniversityName(res);
		}
	};

	const handleDeleteRecommender = (id: string) => {
		const res = postAuthenticatedData(
			"/recommendation_status/university/delete",
			{
				id: id,
			}
		);

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

	const handleUpdateRecommender = (id: string, value: boolean) => {
		postAuthenticatedData("/recommendation_status/university/update", {
			id: id,
			is_lor_submitted: value,
		});
	};

	onMount(() => {
		toast.promise(fetchRecommenders(), {
			loading: "Fetching data...",
			success: (val) => <span>Fetched data</span>,
			error: <span>Could not fetch data</span>,
		});
	});

	return (
		<div class="px-8 py-4">
			<h1 class="text-xl">Recommenders</h1>
			<h1 class="text-2xl font-thin mt-8">{universityname()}</h1>
			<table class="mt-4">
				<thead>
					<tr class="text-left">
						<th>Recommender Name</th>
						<th>Submitted</th>
					</tr>
				</thead>
				<tbody>
					<For each={recommenders()}>
						{(recommender) => (
							<tr>
								<td class="w-80">{recommender.name} </td>
								<td class="p-4">
									<input
										type="checkbox"
										name={"recommender-" + recommender.id}
										id={"recommender-" + recommender.id}
										checked={
											recommender.is_lor_submitted === "YES" ||
											Boolean(recommender.is_lor_submitted)
										}
										class="w-6 h-6 border rounded-md focus:outline-none focus:border-blue-500"
										onInput={(e) =>
											handleUpdateRecommender(recommender.id, e.target.checked)
										}
									/>
								</td>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	);
}
