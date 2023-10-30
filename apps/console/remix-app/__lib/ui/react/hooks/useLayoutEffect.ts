
import * as React from "react"

import { isWebBrowser } from "@/utils/env"
import noOp from "@/utils/functions/no-op"

const useLayoutEffect = isWebBrowser ? React.useLayoutEffect : noOp

export default useLayoutEffect
