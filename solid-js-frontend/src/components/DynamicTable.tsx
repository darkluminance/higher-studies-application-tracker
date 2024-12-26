import { createSignal, For, Show } from "solid-js";
import { Universities } from "../models/University";
import RemoveIcon from "./Icons/RemoveIcon";
import { Faculties } from "../models/Faculty";

export default function DynamicTable(props: {
	data: any;
	setEditData: Function;
	deleteFunction: Function;
	universityList?: Universities[];
	facultyList?: Faculties[];
}) {
	const { data } = props;
	const [showDeleteButton, setShowDeleteButton] = createSignal();

	const filteredData = data.map((item: any) => {
		const filtered = item;
		Object.keys(filtered).forEach((key) => {
			if (
				typeof filtered[key] === "string" &&
				!isNaN(Date.parse(filtered[key]))
			) {
				const parsedDate = new Date(filtered[key]);
				if (!isNaN(parsedDate.getTime())) {
					filtered[key] =
						key === "created_at" || key === "updated_at"
							? parsedDate.toUTCString().slice(0, -4)
							: parsedDate.toDateString();
				}
			} else if (typeof filtered[key] === "boolean") {
				filtered[key] = filtered[key] ? "YES" : "NO";
			}
		});
		return filtered;
	});

	const formattedData = (
		val: string | number | boolean | null,
		header: string
	) => {
		let returnValue = val?.toString();

		if (header === "university_id" && props.universityList) {
			const university = props.universityList.filter(
				(uni: any) => uni.id === val
			)[0];
			returnValue = university?.name;
		}

		if (header === "faculty_id" && props.facultyList) {
			const faculty = props.facultyList.filter((uni: any) => uni.id === val)[0];
			returnValue = faculty?.name;
		}

		return returnValue;
	};

	const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

	return (
		<div class="overflow-x-auto py-8">
			<Show
				when={filteredData && filteredData.length > 0}
				fallback={<div class="text-center">No data</div>}
			>
				<table class="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-lg">
					<thead>
						<tr class="bg-gray-100">
							<th class="px-6 text-left text-sm font-medium text-gray-600 border-b border-gray-200"></th>
							<For
								each={headers.filter(
									(header) => header !== "id" && header !== "user_id"
								)}
							>
								{(header) => (
									<th class="p-4 text-left text-sm font-medium text-gray-600 border-b border-gray-200 truncate">
										{header.charAt(0).toUpperCase() +
											header
												.slice(1)
												.replaceAll("_", " ")
												.replaceAll(" id", "")}
									</th>
								)}
							</For>
							{/* <th class="px-4 py-2 text-left text-sm font-medium text-gray-600 border-b border-gray-200">
								Action
							</th> */}
						</tr>
					</thead>
					<tbody>
						<For each={filteredData}>
							{(row) => (
								<tr
									class="hover:bg-gray-200 cursor-pointer"
									title="Click to edit this row"
									onClick={(e) => {
										e.stopPropagation();
										props.setEditData(row);
									}}
									onMouseEnter={(e) => {
										e.stopPropagation();
										setShowDeleteButton(row.id);
									}}
									onMouseLeave={(e) => {
										e.stopPropagation();
										setShowDeleteButton();
									}}
								>
									<td class="pl-4 border-b border-gray-200 hover:bg-gray-300">
										<Show when={showDeleteButton() === row.id}>
											<span
												class="cursor-pointer"
												onClick={(e) => {
													e.stopPropagation();
													props.deleteFunction(row.id);
												}}
												title="Delete this row"
											>
												<RemoveIcon width="24px" height="24px"></RemoveIcon>
											</span>
										</Show>
									</td>
									<For
										each={headers.filter(
											(header) => header !== "id" && header !== "user_id"
										)}
									>
										{(header) => (
											<td
												class={
													"p-4 text-sm text-gray-700 border-b border-gray-200 truncate " +
													(row[header] === "NO"
														? "text-red-500"
														: row[header] === "YES"
														? "text-green-500"
														: "") +
													(typeof row[header] === "number" ? "text-right" : "")
												}
											>
												{formattedData(row[header], header)}
											</td>
										)}
									</For>
									{/* <td class="px-4 py-2 text-sm text-red-500 border-b border-gray-200 truncate flex gap-4">
										<span
											class=" hover:underline hover:text-red-300 cursor-pointer"
											onClick={(e) => {
												e.stopPropagation();
												props.deleteFunction(row.id);
											}}
										>
											Delete
										</span>
									</td> */}
								</tr>
							)}
						</For>
					</tbody>
				</table>
			</Show>
		</div>
	);
}
