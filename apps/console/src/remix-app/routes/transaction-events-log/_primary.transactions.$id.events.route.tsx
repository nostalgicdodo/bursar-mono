
import type {
	LoaderFunction,
	MetaFunction
} from "@remix-run/node"

import TransactionEventsLogView from "./view"
import { useLoaderData } from "@remix-run/react"
import { ViewDataProvider } from "@/ui/react/context-providers/view"
import { getUserFromSessionOrPromptLogin } from "@/package-utils/remix/http"





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


export default function View () {
	const { transactionId, instituteId, refId } = useLoaderData()
	return <ViewDataProvider value={{ transactionId, instituteId, refId }}>
		<TransactionEventsLogView />
	</ViewDataProvider>
}
