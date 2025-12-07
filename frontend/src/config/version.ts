// Version configuration for the application
export const APP_CONFIG = {
	version: "0.1.0", // This will be overridden by build-time environment variables
	environment: import.meta.env.MODE || "development",
	isDevelopment: import.meta.env.DEV,
	isProduction: import.meta.env.PROD,
} as const;

// Get version from build-time environment or fallback to config
export const getAppVersion = (): string => {
	try {
		const envVersion = import.meta.env.VITE_APP_VERSION;
		if (envVersion) {
			return envVersion.replace(/^v/, ""); // Remove 'v' prefix if present
		}
	} catch (error) {
		console.warn("Could not read VITE_APP_VERSION:", error);
	}

	return APP_CONFIG.version;
};
