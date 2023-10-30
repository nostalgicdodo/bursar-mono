
import { cssBundleHref } from "@remix-run/css-bundle"
import type { LinksFunction, V2_MetaFunction } from "@remix-run/node"
import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react"





export const meta: V2_MetaFunction = () => {
	return [
		...microsoftTiles,
	]
}

export const links: LinksFunction = () => [
	...appleTouchIcons,
	...androidIcons,
	...icons,
	manifest,
	...( cssBundleHref ? [ { rel: "stylesheet", href: cssBundleHref } ] : [ ] ),
]

export default function Root () {
	return <html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width,initial-scale=1" />
			<Meta />
			<Links />
		</head>
		<body>
			<Outlet />
			<ScrollRestoration />
			<Scripts />
			{/* <LiveReload /> */}
		</body>
	</html>
}









/*
 |
 | Meta-data
 | 	(goes into the `meta` slot)
 |
 |
 */
const microsoftTiles = [
	{ name: "msapplication-TileColor", content: "#444444", key: "mst_1" },
	{ name: "msapplication-TileImage", content: "/media/favicons/ms-icon-144x144.png", key: "mst_2" },
]

/*
 |
 | Icons, Manifests, etc.
 | 	(goes into the `links` slot)
 |
 |
 */
const appleTouchIcons = [ "57", "60", "72", "76", "114", "120", "144", "152", "180" ].map(
	s => ({ rel: "apple-touch-icon", sizes: `${s}x${s}`, href: `/media/favicons/apple-icon-${s}x${s}.png` })
)
const androidIcons = [
	{ rel: "icon", type: "image/png", sizes: "192x192", href: "/media/favicons/android-icon-192x192.png" }
]
const icons = [ "16", "32", "96" ].map(
	s => ({ rel: "icon", type: "image/png", sizes: `${s}x${s}`, href: `/media/favicons/favicon-${s}x${s}.png` })
)
const manifest = { rel: "manifest", href: "/media/favicons/manifest.json" }
