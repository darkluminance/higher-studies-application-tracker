/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module "*.svg" {
	const src: string;
	export default src;
}
