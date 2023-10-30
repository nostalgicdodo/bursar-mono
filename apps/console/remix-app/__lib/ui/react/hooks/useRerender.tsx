
import * as React from "react"

import negate from "@/utils/functions/negate"

export default function useRerender () {
	const [ , rerender ] = React.useReducer( negate, false )
	return rerender
}
