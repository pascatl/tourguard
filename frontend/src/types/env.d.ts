// Global type definitions for environment variables

// Vite Environment Variables
interface ImportMetaEnv {
	readonly MODE: string;
	readonly DEV: boolean;
	readonly PROD: boolean;
	readonly SSR: boolean;
	readonly VITE_APP_VERSION?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

// Legacy React Environment Variables (falls noch verwendet)
declare namespace NodeJS {
	interface ProcessEnv {
		REACT_APP_VERSION?: string;
	}
}
