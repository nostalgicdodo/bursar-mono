
/**
 |
 | Overridable Promise
 |
 | A promise that can be externally settled.
 |
 |
 */

import type { FunctionType } from "@/utilities/typescript-types/common-types"

export default class OverridablePromise extends Promise {
	constructor ( fn?: FunctionType ) {
		let _resolve
		let _reject
		super( ( resolve, reject ) => {
			// this.resolve = resolve
			// this.reject = reject
			_resolve = resolve
			_reject = reject
			if ( typeof fn === "function" ) {
				fn( resolve, reject )
			}
		} )
		this.resolve = _resolve
		this.reject = _reject
	}
}
