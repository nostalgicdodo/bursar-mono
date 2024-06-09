
import type {
	MetaFunction,
	LinksFunction,
} from "@remix-run/node"

import { useEffect } from "react"
import {
	Link,
	Meta,
	Outlet,
	useNavigate,
	useRouteError,
} from "@remix-run/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { isWebBrowser } from "@/utilities/env"
import { isNotEmpty } from "@/utilities/type-checking/meta"
import TrackLayoutRegions from "@/ui/react/components/track-layout-regions"
import { StackedScreen, StackedScreensProvider } from "@/ui/react/context-providers/stacked-screens"
import { MessagesProvider } from "@/ui/react/context-providers/messages"
import MessagingHub from "@/ui/react/components/messaging-hub"
import { TaskQueueProvider } from "@/ui/react/context-providers/task-queue"
import { useRootContext } from "@/ui/react/context-providers/root"

import styles from "@/ui/stylesheets/tailwind.css?url"





const queryClient = new QueryClient()

export const links: LinksFunction = () => [
	// Fonts
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	// { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
	{ rel: "preconnect", href: "https://fonts.gstatic.com" },
	{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Playfair+Display:wght@400;700&display=swap" },

	// Stylesheets
	{ rel: "stylesheet", href: styles },
]

const mainRegionDimensionStyles = [
	"min-h-[var(--main-region-min-height,calc(100vh-var(--space-450)))]",
	"md:min-h-[var(--main-region-min-height,calc(100vh-var(--space-250)))]",
	"lg:min-h-[var(--main-region-min-height,calc(100vh-var(--space-200)))]",
].join( " " )

export default function PrimaryLayout ( { children }: { children: React.ReactNode } ) {
	return <TaskQueueProvider>
		<QueryClientProvider client={ queryClient }>
			<MessagesProvider>
				<StackedScreensProvider>
					<StackedScreen className="min-h-full h-full">
						{ ({ mainContentAreaRef }) => <>
							<div>
								<div id="sticky-region-top" className="sticky top-0 z-50">
									{/* { Header && <div className="bg-white shadow-1">
										<Header className="container" />
									</div> } */}
								</div>
								<div className="relative z-20 /*temp*/ z-[60] /*ENDtemp*/">
									<div className="fixed /*temp*/ top-0 /*ENDtemp*/ px-75 py-75 h-screen overflow-hidden">
										<MessagingHub className="flex flex-col-reverse items-baseline h-full" />
									</div>
								</div>
								<div className={ `${ mainRegionDimensionStyles } relative top-0 w-full` } ref={ mainContentAreaRef }>
									<Outlet />
									{ children }
								</div>
								<div className="max-md:mt-250">
									<div id="sticky-region-bottom" className="fixed bottom-0 w-full z-50">
										{/* { Footer && <Footer className="py-50 shadow-[0_-1px_4px_0_rgba(0,0,0,0.2)] md:hidden bg-white" /> } */}
									</div>
								</div>
								{ isWebBrowser && <TrackLayoutRegions /> }
							</div>
						</> }
					</StackedScreen>
				</StackedScreensProvider>
			</MessagesProvider>
		</QueryClientProvider>
	</TaskQueueProvider>
}



export function ErrorBoundary () {
	const e = useRouteError()
	const { environment: { APP_PLATFORM, THIS_IS } } = useRootContext()
	const navigate = useNavigate()

	useEffect( function () {
		console.log( e )
		// ^ for debugging purposes during production
	}, [ ] )

	if ( isNotEmpty( e ) && e?.data?.route === null ) {
		if ( APP_PLATFORM !== "web" ) {
			navigate( "/", { replace: true } )
			return
		}
		return <PrimaryLayout>
			<div className="container flex flex-col md:items-center justify-center md:space-y-25">
				<h2 className="h5 md:h3 text-neutral-6">Page could not be found or does not exist.</h2>
				<p className="p md:h6 text-neutral-4">
					<Link to="/" className="text-orange-2 underline">Click here</Link> to go back to the home page.
				</p>
			</div>
		</PrimaryLayout>
	}

	return <PrimaryLayout>
		<div className="container flex flex-col md:items-center justify-center md:space-y-25">
			<h2 className="h5 md:h3 text-neutral-6">An unexpected error has occurred.</h2>
			<p className="p md:h6 text-neutral-4">
				Kindly { APP_PLATFORM === "web" ? "refresh the page" : "close and re-open the app" }, or try again after a while.
			</p>
		</div>
	</PrimaryLayout>
}
