import LoadingSpinner from "./Icons/LoadingSpinner";

export default function LoadingButton(props: {
	loading: boolean;
	text: string;
}) {
	return (
		<button
			class="w-full px-4 py-2 bg-cyan-500 text-white flex justify-center rounded-md hover:bg-cyan-600 focus:outline-none"
			disabled={props.loading}
			type="submit"
		>
			{props.loading ? <LoadingSpinner></LoadingSpinner> : props.text}
		</button>
	);
}
