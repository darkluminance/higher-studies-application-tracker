import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Dev server mirrors the legacy SolidJS frontend (port 3000, polling for Docker parity).
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: "0.0.0.0",
		port: 3000,
		hmr: {
			clientPort: 3000,
		},
		watch: {
			usePolling: true,
		},
	},
	preview: {
		host: "0.0.0.0",
		port: 3000,
	},
	build: {
		target: "esnext",
	},
});
