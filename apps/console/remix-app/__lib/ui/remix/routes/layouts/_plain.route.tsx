
import type {
	V2_MetaFunction,
	LinksFunction,
} from "@remix-run/node"

import * as React from "react"
import {
	Link,
	Meta,
	Outlet,
	useRouteError,
} from "@remix-run/react"

import styles from "@/ui/stylesheets/tailwind/tailwind.css"
import { isNotEmpty } from "remix-app/__lib/utils/type-checking/meta"





export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: styles },
]

export default function PlainLayout ( { children } ) {
	return <div className="min-h-full h-full">
		<Outlet />
		{ children }
	</div>
}



export function ErrorBoundary () {
	const e = useRouteError()

	React.useEffect( function () {
		console.log( e )
		// ^ for debugging purposes during production
	}, [ ] )

	if ( isNotEmpty( e ) && e?.data?.route === null ) {
		return <PlainLayout>
			<div className="min-h-screen container flex flex-col md:items-center justify-center md:space-y-25">
				<h2 className="h5 md:h3 text-neutral-6">Page could not be found or does not exist.</h2>
				<p className="p md:h6 text-neutral-4">
					<Link to="/" className="text-orange-2 underline">Click here</Link> to go back to the home screen.
				</p>
			</div>
		</PlainLayout>
	}

	return <PlainLayout>
		<div className="min-h-screen container flex flex-col md:items-center justify-center md:space-y-25">
			<h2 className="h5 md:h3 text-neutral-6">An unexpected error has occurred.</h2>
			<p className="p md:h6 text-neutral-4">Kindly refresh/restart the app, or try again after a while.</p>
		</div>
	</PlainLayout>
}
