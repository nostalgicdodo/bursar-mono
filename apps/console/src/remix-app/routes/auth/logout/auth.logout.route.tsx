
import type {
	LoaderFunctionArgs,
	LoaderFunction,
	ActionFunctionArgs,
	ActionFunction,
} from "@remix-run/node"

import { redirectResponse } from "@/package-utils/remix/http"





export function loader ( { request }: LoaderFunctionArgs ): Promise<ReturnType<LoaderFunction>> {
	return redirectResponse( "/" )
}
export function action ( { request }: ActionFunctionArgs ): Promise<ReturnType<ActionFunction>> {
	return redirectResponse( "/" )
}
