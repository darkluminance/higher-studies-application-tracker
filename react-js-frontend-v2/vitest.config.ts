import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		css: false,
		env: {
			VITE_BACKEND_URL: "http://api.test/v1",
		},
		restoreMocks: true,
		clearMocks: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "html", "json-summary"],
			reportsDirectory: "./coverage",
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				"src/main.tsx",
				"src/vite-env.d.ts",
				"src/test/**",
				"src/**/*.test.{ts,tsx}",
				"src/assets/**",
			],
		},
	},
});
