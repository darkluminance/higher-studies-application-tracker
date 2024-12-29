import { createSignal, onMount, Show } from "solid-js";
import DynamicTable from "./DynamicTable";
import ItemInputBase from "./ItemInputBase";
import toast from "solid-toast";

export default function BaseAllEntries(props: any) {
	const [showItemInputter, setShowItemInputter] = createSignal(false);
	const [editData, setEditData] = createSignal();

	const handleCompleteSubmit = () => {
		setEditData();
		setShowItemInputter(false);
		props.fetchData();
	};

	const handleEdit = (val: any) => {
		if (props.editFormatter) {
			val = props.editFormatter(val);
		}

		const { created_at, updated_at, ...item } = val;

		setEditData(item);
		setShowItemInputter(true);
	};

	onMount(() => {
		toast.promise(props.fetchData(), {
			loading: "Fetching data...",
			success: (val) => <span>Fetched data</span>,
			error: <span>Could not fetch data</span>,
		});
	});

	return (
		<div class="px-8 py-4">
			<Show when={!showItemInputter()}>
				<div>
					<div class="flex justify-between">
						<h1 class="text-xl">{props.title} </h1>
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
					<Show when={props.data}>
						<Show when={props.filterList}>
							<div class="mt-4">
								<label for="designation">{props.filterByTitle}:</label>
								<div class="flex gap-4">
									<select
										class="w-96 px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
										value={props.filterID || ""}
										onChange={(e) => {
											if (e.target.value !== "")
												props.handleFilterChange({
													[props.filterKey]: e.target.value,
												});
											else props.handleFilterChange();
										}}
									>
										<option selected value="">
											All
										</option>
										{props.filterList.map(
											(item: { id: string; name: string }) => (
												<option value={item.id}>{item.name}</option>
											)
										)}
									</select>
								</div>
							</div>
						</Show>
						<DynamicTable
							data={props.data}
							setEditData={(val: any) => handleEdit(val)}
							deleteFunction={props.handleDelete}
							universityList={props.universityList}
							facultyList={props.facultyList}
							recommenderList={props.recommenderList}
						></DynamicTable>
					</Show>
				</div>
			</Show>
			<Show when={showItemInputter()}>
				<ItemInputBase
					closeFunction={() => {
						setShowItemInputter(false);
						setEditData();
					}}
					component={props.formComponent}
					editData={editData()}
					fallback={handleCompleteSubmit}
				></ItemInputBase>
			</Show>
		</div>
	);
}
