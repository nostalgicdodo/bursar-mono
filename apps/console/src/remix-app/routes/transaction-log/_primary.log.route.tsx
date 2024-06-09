
import type {
	MetaFunction,
	LinksFunction,
	LoaderFunction
} from "@remix-run/node"

import { ViewDataProvider } from "@/ui/react/context-providers/view"
import reactDayPickerStylesheet from "react-day-picker/dist/style.css?url"
import { getUserFromSessionOrPromptLogin } from "@/package-utils/remix/http"
import TransactionLogView from "./view"








export const loader: LoaderFunction = async ( { request, context, params } ) => {
	await getUserFromSessionOrPromptLogin( request, context )

	const url = new URL( request.url )

	return {
		transactionId: params.id,
		instituteId: url.searchParams.get( "instituteId" ),
		refId: url.searchParams.get( "refId" ),
	}
}

export const meta: MetaFunction = () => {
	return [
		{ title: "bursar" },
		{ name: "description", content: "console." },
	]
}

export const links: LinksFunction = () => [
	{ rel: "stylesheet", href: reactDayPickerStylesheet },
]

export default function View () {
	return <ViewDataProvider value={ { } }>
		<TransactionLogView />
	</ViewDataProvider>
}
