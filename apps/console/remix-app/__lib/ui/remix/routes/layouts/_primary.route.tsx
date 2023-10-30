
import * as React from "react"
import {
	type V2_MetaFunction,
	type LinksFunction,
	json,
} from "@remix-run/node"
import {
	Link,
	Meta,
	Outlet,
	useMatches,
	useRouteError,
} from "@remix-run/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import styles from "@/ui/stylesheets/tailwind/tailwind.css"
// import loadingIndicatorStyles from "@/ui/react/components/loading-indicators/circular-loading-indicator.css"
import { isNotEmpty } from "remix-app/__lib/utils/type-checking/meta"

import MessagingHub from "@/ui/react/components/messaging-hub"
import { MessagesProvider } from "@/ui/react/context-providers/messages"
import Header from "@/ui/react/components/header"
import getHeader from "@/this/remix/get-header"





const queryClient = new QueryClient()

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	// { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
	{ rel: "preconnect", href: "https://fonts.gstatic.com" },
	{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" },

	{ rel: "stylesheet", href: styles },
	// { rel: "stylesheet", href: loadingIndicatorStyles },
]

export default function PrimaryLayout ( { children } ) {
	const Header = getHeader()

	return <QueryClientProvider client={ queryClient }>
		<MessagesProvider>
			<div className="min-h-full h-full">
				{ Header && <div className="fixed top-0 w-full z-50">
					<Header className="mt-50 container scale-x-105 origin-center" />
				</div> }
				<div id="sticky-region-top" className="sticky top-0 z-50">
				</div>
				<div className="relative z-20">
					<div className="fixed px-75 py-75 h-screen overflow-hidden pointer-events-none">
						<MessagingHub className="flex flex-col-reverse items-baseline h-full" />
					</div>
				</div>
				<div id="sticky-region-bottom" className="fixed bottom-0 w-full z-50 _[&+*]:pb-200">
				</div>
				<div className="relative min-h-full h-full">
					<div id="modal-region" className="relative w-full z-10"></div>
					<div id="non-modal-region" className="top-0 w-full min-h-full h-full">
						<Outlet />
						{ children }
					</div>
				</div>
			</div>
		</MessagesProvider>
	</QueryClientProvider>
}



export function ErrorBoundary () {
	const e = useRouteError()

	React.useEffect( function () {
		// console.log( e )
		// ^ for debugging purposes during production
	}, [ ] )

	if ( isNotEmpty( e ) && e?.data?.route === null ) {
		return <PrimaryLayout>
			<div className="min-h-screen container flex flex-col md:items-center justify-center md:space-y-25">
				<h2 className="h5 md:h3 text-neutral-6">Page could not be found or does not exist.</h2>
				<p className="p md:h6 text-neutral-4">
					<Link to="/" className="text-orange-2 underline">Click here</Link> to go back to the home screen.
				</p>
			</div>
		</PrimaryLayout>
	}

	return <PrimaryLayout>
		<div className="min-h-screen container flex flex-col md:items-center justify-center md:space-y-25">
			<h2 className="h5 md:h3 text-neutral-6">An unexpected error has occurred.</h2>
			<p className="p md:h6 text-neutral-4">Kindly refresh/restart the app, or try again after a while.</p>
		</div>
	</PrimaryLayout>
}
