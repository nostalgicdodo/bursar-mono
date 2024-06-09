
/**
 |
 | Route and Middleware registration for the Remix application
 |
 |
 */

import path from "node:path"
import { fileURLToPath } from "node:url"
import express from "express"
import { createRequestHandler } from "@remix-run/express"

const router = express.Router()

const viteDevServer = process.env.NODE_ENV === "development"
	? await import( "vite" ).then( ( vite ) =>
		vite.createServer( {
			server: { middlewareMode: true },
		} )
	)
	: undefined

const remixHandler = createRequestHandler( {
	build: process.env.NODE_ENV === "development"
		? () => viteDevServer.ssrLoadModule( "virtual:remix/server-build" )
		: await import( "../../build/server/index.js" ),
	getLoadContext ( req, res ) {
		return {
			...( req.remixContext || { } ),
			session: req.session || { },
			responseHeaders: res.getHeaders(),
		}
	}
} )

// handle asset requests
if ( process.env.NODE_ENV === "development" ) {
	router.use( viteDevServer.middlewares )
}
else {
	const __dirPath = fileURLToPath( new URL( ".", import.meta.url ) )

	// Vite fingerprints its assets so we can cache forever
	const assetsDirectory = path.join( __dirPath, "../../build/client/assets" )
	router.use(
		"/assets",
		express.static( assetsDirectory, { immutable: true, maxAge: "1y" } )
	)

	const mediaDirectory = path.join( __dirPath, "../../public/media" )
	router.use(
		"/media",
		express.static( mediaDirectory )
	)
}


// handle SSR requests
router.all( "*", remixHandler )

export default router
