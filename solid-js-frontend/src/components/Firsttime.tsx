import { createSignal, Show } from "solid-js";
import { setUserData } from "../stores/UserStore";
import AddIcon from "./Icons/AddIcon";
import ItemInputBase from "./ItemInputBase";
import UniversityListForm from "./Inputs/UniversityListForm";

export default function Firsttime() {
	const [showItemInputter, setShowItemInputter] = createSignal(false);
	const handleAddList = () => {
		setShowItemInputter(true);
	};
	return (
		<>
			<div class="h-full text-4xl space-y-5 flex flex-col items-center justify-center">
				<div class="cursor-pointer hover:opacity-40" onClick={handleAddList}>
					<AddIcon width="80" height="80" stroke="#000000" />
				</div>
				<div>Looks like you don't have any list</div>
				<div>Click on the '+' icon to create a list</div>
			</div>
			<Show when={showItemInputter()}>
				<ItemInputBase
					closeFunction={() => setShowItemInputter(false)}
					component={UniversityListForm}
				></ItemInputBase>
			</Show>
		</>
	);
}
