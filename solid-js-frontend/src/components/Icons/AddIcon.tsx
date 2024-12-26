const AddIcon = (props) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
			<circle
				cx="12"
				cy="12"
				r="11"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
			/>
			<line
				x1="12"
				y1="6"
				x2="12"
				y2="18"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
			/>
			<line
				x1="18"
				y1="12"
				x2="6"
				y2="12"
				fill="none"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="1.5"
			/>
		</svg>
	);
};

export default AddIcon;
