
import type {
	LinksFunction
} from "@remix-run/node"

import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "@remix-run/react"

import styles from "@/ui/stylesheets/tailwind.css?url"





export const links: LinksFunction = () => [
	// Meta
	...appleTouchIcons,
	...androidIcons,
	...icons,
	manifest,

	// Fonts
	// { rel: "preconnect", href: "https://fonts.googleapis.com" },
	// { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
	// { rel: "preconnect", href: "https://fonts.gstatic.com" },
	// { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" },

	// Stylesheets
	// { rel: "stylesheet", href: styles },
]

export function Layout ( { children }: { children: React.ReactNode } ) {
	return <html lang="en">
		<head>
			<meta charSet="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<Meta />
			<Links />
		</head>
		<body>
			{ children }
			<ScrollRestoration />
			<Scripts />
		</body>
	</html>
}

export default function RootRoute () {
	return <Outlet />
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
