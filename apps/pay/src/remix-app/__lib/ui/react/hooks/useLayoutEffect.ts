
import * as React from "react"

import { isWebBrowser } from "@/utilities/env"
import noOp from "@/utilities/functions/no-op"

const useLayoutEffect = isWebBrowser ? React.useLayoutEffect : noOp

export default useLayoutEffect
