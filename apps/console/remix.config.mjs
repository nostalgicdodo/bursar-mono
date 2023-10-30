
import path from "node:path"
import { fileURLToPath } from "node:url"

import { routeExtensions } from "remix-custom-routes"



/** @type {import('@remix-run/dev').AppConfig} */

export default {
	appDirectory: "remix-app",
	cacheDirectory: "./cache/remix",

	ignoredRouteFiles: [ "**/.*" ],
		// ^ it does not seem possible to ignore
		//  	the default `/routes` directory (in the "app" directory)
	async routes () {
		const __dirname = fileURLToPath( new URL( ".", import.meta.url ) )
		return routeExtensions( path.join( __dirname, this.appDirectory ) )
	},

	// assetsBuildDirectory: "public/build",
	// serverBuildPath: "build/index.js",
	// publicPath: "/build/",
	serverModuleFormat: "cjs",
	future: {
		v2_dev: true,
		v2_errorBoundary: true,
		v2_headers: true,
		v2_meta: true,
		v2_normalizeFormMethod: true,
		v2_routeConvention: true,
	},

	postcss: true,
	tailwind: true,

	serverDependenciesToBundle: [
		"dot-prop",
	]
}
