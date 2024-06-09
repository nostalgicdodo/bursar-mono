
import type { FunctionType } from "@/utilities/typescript-types/common-types"

import { isWebBrowser } from "@/utilities/env"

const useOnlyOnWebBrowser = isWebBrowser ? useHook : getFallback

type UseOnlyOnWebBrowserArgs = [
	hook: FunctionType,
	fallback: any,
		// ^ this argument will typically mimic
		// 	the return value of the hook that is passed (in the first argument)
	...args: unknown[],
]

function useHook ( hook: FunctionType, fallback: any, ...args: unknown[] ) {
	return hook( ...args )
}

function getFallback ( hook: FunctionType, fallback: any ) {
	return fallback
}

export default useOnlyOnWebBrowser
