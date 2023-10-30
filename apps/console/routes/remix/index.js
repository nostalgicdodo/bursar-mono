
const fs = require( "node:fs" )
const path = require( "node:path" )

const { createRequestHandler } = require( "@remix-run/express" )
const { broadcastDevReady, installGlobals } = require( "@remix-run/node" )
const chokidar = require( "chokidar" )
const express = require( "express" )
const morgan = require( "morgan" )

const { isDev } = require( "@root/server" )

installGlobals()

const BUILD_DIR = path.resolve( __dirname, "../../build" )
	// ^ NOTE: This needs to be an absolute path,
	//  	else HMR and HDR do not work
const BUILD_PATH = BUILD_DIR + "/index.js"

/**
 * @type { import('@remix-run/node').ServerBuild | Promise<import('@remix-run/node').ServerBuild> }
 */
let build = require( BUILD_PATH )
	// ^ This build path needs to be imported at the root scope
	//  	even though it seems redundant,
	//  	else this error shows up:
	//  	TypeError: Cannot read properties of undefined (reading 'routes')
const router = express.Router()

// Remix fingerprints its assets so we can cache forever.
router.use(
	"/build",
	express.static( "public/build", { immutable: true, maxAge: "1y" } )
)

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
router.use( express.static( "public", { maxAge: "1h" } ) )

// if ( process.env.NODE_ENV === "development" ) {
if ( isDev() ) {
	router.use( morgan( "tiny" ) )
}

router.all(
	"*",
	// process.env.NODE_ENV === "development"
	isDev()
		? createDevRequestHandler()
		: createProductionRequestHandler()
)





/*
 |
 | The bridge between Express and Remix
 |
 |
 */
function getLoadContext ( req, res ) {
	return {
		...( req.remixContext || { } ),
		session: req.session || { },
		responseHeaders: res.getHeaders(),
	}
}

function createProductionRequestHandler () {
	return createRequestHandler( {
		build: require( BUILD_PATH ),
		mode: process.env.NODE_ENV,
		getLoadContext,
	} )
}

function createDevRequestHandler () {
	const watcher = chokidar.watch( BUILD_PATH, { ignoreInitial: true } )

	watcher.on( "all", async () => {
		// 1. purge require cache && load updated server build
		// build = require( BUILD_PATH + "?t=" + stat.mtimeMs )
		purgeRequireCache()
		build = require( BUILD_PATH )
		// 2. tell dev server that this app server is now ready
		broadcastDevReady( build )
	} )

	return async ( req, res, next ) => {
		try {
			return createRequestHandler( {
				build: await build,
				mode: "development",
				getLoadContext,
			} )( req, res, next )
		}
		catch ( e ) {
			next( e )
		}
	}
}

function purgeRequireCache () {
	// purge require cache on requests for "server side HMR" this won't let
	// you have in-memory objects between requests in development,
	// alternatively you can set up nodemon/pm2-dev to restart the server on
	// file changes, but then you'll have to reconnect to databases/etc on each
	// change. We prefer the DX of this, so we've included it for you by default
	for ( let key in require.cache ) {
		if ( key.startsWith( BUILD_DIR ) ) {
			delete require.cache[ key ]
		}
	}
}





module.exports = router
