
import type {
	LoaderArgs,
	LoaderFunction,
	ActionArgs,
	ActionFunction,
} from "@remix-run/node"

import { redirectResponse } from "@/package-utils/remix/http"





export function loader ( { request }: LoaderArgs ): Promise<ReturnType<LoaderFunction>> {
	return redirectResponse( "/" )
}
export function action ( { request }: ActionArgs ): Promise<ReturnType<ActionFunction>> {
	return redirectResponse( "/" )
}
