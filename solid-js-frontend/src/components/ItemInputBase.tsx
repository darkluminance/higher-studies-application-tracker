export default function ItemInputBase(props: any) {
	return (
		<div class="fixed top-0 left-0 h-screen w-screen bg-black/50 flex justify-center items-center">
			<div class="min-w-96 p-8 bg-white">
				<div class="text-base flex justify-end">
					<span
						class="cursor-pointer hover:opacity-50"
						onClick={props.closeFunction}
					>
						Close
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
