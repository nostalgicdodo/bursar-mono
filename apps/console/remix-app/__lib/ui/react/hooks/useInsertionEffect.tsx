
import * as React from "react"

import noOp from "remix-app/__lib/utils/functions/no-op"

const canUseDOM = !!(
	typeof window !== "undefined" &&
	window.document &&
	window.document.createElement
)

const useInsertionEffect = canUseDOM ? React.useInsertionEffect : noOp

export default useInsertionEffect
