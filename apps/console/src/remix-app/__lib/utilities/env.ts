
export const isWebBrowser = !!(
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement
)

export const isServer = ! isWebBrowser

export const runtimeEnv = isWebBrowser ? "browser" : "server"
