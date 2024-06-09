
import * as React from "react"

import { isWebBrowser } from "@/utilities/env"
import noOp from "@/utilities/functions/no-op"

const useInsertionEffect = isWebBrowser ? React.useInsertionEffect : noOp

export default useInsertionEffect
