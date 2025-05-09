
/**
 |
 | By default, Remix will handle hydrating your app on the client for you.
 | For more information, see https://remix.run/file-conventions/entry.client
 |
 |
 */

import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

startTransition( () => {
	hydrateRoot(
		document,
		<StrictMode>
			<RemixBrowser />
		</StrictMode>
	)
} )
