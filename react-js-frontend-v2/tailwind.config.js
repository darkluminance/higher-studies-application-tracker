/** @type {import('tailwindcss').Config} */
// "Warm Paper" design system — cream & clay, calm. Tokens transcribed from the design handoff.
export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			colors: {
				// Surfaces & structure
				canvas: "#eceae4",
				paper: {
					DEFAULT: "#f5efe4",
					raised: "#fbf7ef",
					sunken: "#f6f1e7",
				},
				rail: "#efe7d8",
				field: "#f5efe4",
				// Ink (text)
				ink: {
					DEFAULT: "#33302a",
					strong: "#3a352d",
					body: "#5f5648",
					muted: "#6d6558",
					soft: "#8a806f",
					faint: "#9a9184",
				},
				label: {
					DEFAULT: "#a99e8c",
					cal: "#b19a75",
				},
				// Borders
				line: {
					DEFAULT: "#e6dccb", // outer card border
					soft: "#ece1cf", // inner card / raised panel
					hair: "#f0e7d7", // table row dividers
					rail: "#e4d9c6", // sidebar divider
					field: "#e2d6c2", // input borders
				},
				// Clay accent (primary brand)
				clay: {
					DEFAULT: "#a26a4f",
					hover: "#98603f",
					ink: "#7a4f38",
					wash: "#e2d3bf",
					wash2: "#efe2d6",
					avatar: "#d8c3a6",
				},
				// Status (muted)
				sage: { DEFAULT: "#5c6a45", bg: "#e4e8da", bar: "#7f8b6a" },
				motion: { DEFAULT: "#8a5a3d", bg: "#efe0d3" }, // in-progress / deadline / GRE
				plum: { DEFAULT: "#7a5766", bg: "#e8dee2" }, // interview
				stone: { DEFAULT: "#857c6b", bg: "#ece5d8" }, // idle / neutral
				amber: { ink: "#b0895a" }, // waiting / draft (no pill)
			},
			fontFamily: {
				serif: ['"Newsreader Variable"', '"Newsreader"', "serif"],
				sans: ['"Mulish Variable"', '"Mulish"', "system-ui", "sans-serif"],
			},
			borderRadius: {
				pill: "20px",
				control: "9px",
				card: "14px",
				"card-lg": "16px",
				frame: "18px",
				mark: "8px",
			},
			boxShadow: {
				frame:
					"0 1px 3px rgba(70,45,10,.05), 0 18px 40px -24px rgba(70,45,10,.22)",
			},
			letterSpacing: {
				micro: "0.13em",
			},
			transitionTimingFunction: {
				calm: "cubic-bezier(0.22, 1, 0.36, 1)",
			},
			maxWidth: {
				content: "1180px",
			},
		},
	},
	plugins: [],
};
