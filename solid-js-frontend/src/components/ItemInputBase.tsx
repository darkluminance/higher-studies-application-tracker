import { createMemo } from "solid-js";
import BackIcon from "./Icons/BackIcon";

export default function ItemInputBase(props: any) {
	const formName = createMemo(() => {
		const formType = props.editData ? "Edit" : "Create";
		const formComponentName = props.component?.name
			.replace("[solid-refresh]", "")
			.replace("Form", "");

		return formType + " " + formComponentName;
	});
	return (
		<div>
			<div class="max-w-[1000px] p-16">
				<div class="text-base flex justify-start">
					<span
						class="cursor-pointer font-bold hover:opacity-50"
						onClick={props.closeFunction}
					>
						<BackIcon width="48px" fill="#333"></BackIcon>
					</span>
				</div>
				<div class="my-8 text-2xl">{formName()}</div>
				<div>
					{props.component && (
						<props.component
							editData={props.editData}
							fallback={props.fallback}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
