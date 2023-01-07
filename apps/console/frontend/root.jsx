
import {
	Links,
	// LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useMatches,
	useCatch
} from "@remix-run/react";

import normalizeStyles from "@ui/css/1_normalize.css"
import baseStyles from "@ui/css/2_base.css"
import gridStyles from "~/css/3_grid.css"
import helperStyles from "@ui/css/4_helper.css"
import stylescapeStyles from "~/css/5_stylescape.css"
import { styles as loadingIndicatorStyles } from "@ui/components/loading-indicator"



let appleTouchIcons = [ "57", "60", "72", "76", "114", "120", "144", "152", "180" ]
					.map( s => ({ rel: "apple-touch-icon", sizes: `${s}x${s}`, href: `/media/favicons/apple-icon-${s}x${s}.png` }) )
let androidIcons = [
	{ rel: "icon", type: "image/png", sizes: "192x192", href: "/media/favicons/android-icon-192x192.png" }
]
let icons = [ "16", "32", "96" ]
			.map( s => ({ rel: "icon", type: "image/png", sizes: `${s}x${s}`, href: `/media/favicons/favicon-${s}x${s}.png` }) )
let manifest = { rel: "manifest", href: "/media/favicons/manifest.json" }
let microsoftTiles = [
	{ name: "msapplication-TileColor", content: "#444444", key: "mst_1" },
	{ name: "msapplication-TileImage", content: "/media/favicons/ms-icon-144x144.png", key: "mst_2" },
]
export const fonts = [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
	{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" },
	{ rel: "stylesheet", href: "https://fonts.googleapis.com/icon?family=Material+Icons" },
]

export const stylesheets = [
	// normalizeStyles,
	// baseStyles,
	gridStyles,
	// helperStyles,
	stylescapeStyles,
	loadingIndicatorStyles,
].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )

export const baseLinks = [ ]
	.concat( appleTouchIcons )
	.concat( androidIcons )
	.concat( icons )
	.concat( manifest )
	.concat( microsoftTiles )





export const handle = {
	metaTitle: "Bursar"
}

export function meta () {
	const matches = useMatches()
	const metaTitles = matches
		.filter( m => ( m.handle && m.handle.metaTitle ) )
		.map( m => m.handle.metaTitle )
		// .map( t => ( Array.isArray( t ) ? t.reverse() : t ) )
		// .flatMap( e => e )

	return {
		charset: "utf-8",
		title: metaTitles.reverse().join( " · " ),
		viewport: "width=device-width,initial-scale=1",
	}
}

export function links () {
	return baseLinks
		.concat( fonts )
		.concat( stylesheets )
}

function uniqueByKey ( array, key ) {
	const uniqueValues = Object.fromEntries( array.map( e => [ e[ key ], true ] ) )
	return array.filter( function ( e ) {
		if ( ! uniqueValues[ e[ key ] ] )
			return false
		uniqueValues[ e[ key ] ] = false
		return true
	} )
}

function ThisScripts () {
	const matches = useMatches()
	const scripts = matches
		.filter( m => ( m.handle && m.handle.scripts ) )
		.flatMap( m => m.handle.scripts )
		.filter( s => s.src )

	const uniqueScripts = uniqueByKey( scripts.reverse(), "src" ).reverse()

	return uniqueScripts.map( function ( s ) {
		return <script key={s.src} {...s}></script>
	} )
}

function inheritRootLayout () {
	return useMatches().pop()?.handle?.inheritRootLayout ?? true
}


export default function App () {
	return (
		<html lang="en">
			<head>
				<Meta />
				<Links />
			</head>
			<body>
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				<ThisScripts />
				{/* <LiveReload /> */}
			</body>
		</html>
	);
}

export function CatchBoundary () {
	const caught = useCatch()

	return (
		<html lang="en">
			<head>
				<Meta />
				<title>There was an issue.</title>
				<Links />
			</head>
			<body>
				<pre><code>{ JSON.stringify( caught, null, "\t" ) }</code></pre>
				<Scripts />
				<ThisScripts />
			</body>
		</html>
	);
}

export function ErrorBoundary ( { error } ) {
	console.error( error )

	return (
		<html lang="en">
			<head>
				<Meta />
				<title>There was an error.</title>
				<Links />
			</head>
			<body>
				<pre><code>{ JSON.stringify( error, null, "\t" ) }</code></pre>
				<Scripts />
				<ThisScripts />
			</body>
		</html>
	);
}
