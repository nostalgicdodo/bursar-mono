
/**
 |
 | This is for the Remix application (located at `src/remix-app`).
 |
 |
 */

import path from "node:path"
import { fileURLToPath } from "node:url"

import { vitePlugin as remix } from "@remix-run/dev"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import { routeExtensions } from "remix-custom-routes"
import tailwindcss from "tailwindcss"





const __dirPath = fileURLToPath( new URL( ".", import.meta.url ) )
const appDirectory = "src/remix-app"

const configuration: Parameters<typeof defineConfig>[ 0 ] = {
	cacheDir: "./cache/vite",
	plugins: [
		remix( {
			appDirectory,
			async routes () {
				return routeExtensions( path.join( __dirPath, appDirectory ) )
			},
			future: {
				v3_fetcherPersist: true,
				v3_relativeSplatPath: true,
				v3_throwAbortReason: true,
			},
		} ),

		tsconfigPaths(),
	],
	css: {
		postcss: {
			plugins: [ tailwindcss() ]
		}
	},
}

export default defineConfig( configuration )
