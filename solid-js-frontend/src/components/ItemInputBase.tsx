export default function ItemInputBase(props: any) {
	return (
		<div>
			<div class="max-w-[1000px] p-8">
				<div class="text-base flex justify-start mb-8">
					<span
						class="cursor-pointer font-bold hover:opacity-50"
						onClick={props.closeFunction}
					>
						{"<- "}Back
					</span>
				</div>
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
