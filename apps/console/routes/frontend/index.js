
const path = require( 'path' );
const express = require( 'express' );
const { createRequestHandler } = require( '@remix-run/express' );



const BUILD_DIR = `${__dirname}/../../build`

const router = express.Router();

// Remix fingerprints its assets so we can cache forever.
router.use(
	'/build',
	express.static( 'public/build', { immutable: true, maxAge: '1y' } )
);

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
router.use( express.static( 'public' , { maxAge: '1h' } ) );
router.use( express.static( `${__dirname}/../../../../public` , { maxAge: '1h' } ) );



const requestHandler = createRequestHandler( {
	build: require( BUILD_DIR ),
	mode: process.env.NODE_ENV || 'development', // TODO
	getLoadContext ( req ) {
		return {
			...(req.renderContext || {}),
			session: req.session || { },
		};
	}
} );

if ( process.env.NODE_ENV === 'production' ) {
	router.all( '*', requestHandler );
}
else {
	router.all( '*', function ( req, res, next ) {
		purgeRequireCache();
		return requestHandler( req, res, next );
	} );
}

function purgeRequireCache () {
	// purge require cache on requests for "server side HMR" this won't let
	// you have in-memory objects between requests in development,
	// alternatively you can set up nodemon/pm2-dev to restart the server on
	// file changes, but then you'll have to reconnect to databases/etc on each
	// change. We prefer the DX of this, so we've included it for you by default
	for ( let key in require.cache ) {
		if ( key.startsWith( BUILD_DIR ) )
			delete require.cache[ key ];
	}
}

module.exports = router;
