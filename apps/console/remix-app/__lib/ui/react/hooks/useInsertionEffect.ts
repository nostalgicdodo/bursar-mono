
import * as React from "react"

import { isWebBrowser } from "@/utils/env"
import noOp from "@/utils/functions/no-op"

const useInsertionEffect = isWebBrowser ? React.useInsertionEffect : noOp

export default useInsertionEffect
