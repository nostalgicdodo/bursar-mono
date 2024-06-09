
/**
 |
 | throttle
 |
 | Features:
 | - only one instance of the wrapped function can be executing
 | 	at any point in time (this is a concern for async functions)
 |
 |
 |
 */

import { isAFunction } from "../type-checking/function"
import { isAFiniteNumber } from "../type-checking/number/identity"

const ASYNC_FUNCTION_CLASSNAME = "AsyncFunction"

export default function throttle ( fn: Function, interval: number = 1, leading = false ) {
	let timeoutId: ReturnType<typeof setTimeout> | null
	interval = interval * 1000
	let fnLastExecutedAt: number | null = null
	let fnArgs: any[]

	function runFunction ( ...args: any[] ) {
		const returnValue = fn( ...args )
		if (
			( fn.constructor.name === ASYNC_FUNCTION_CLASSNAME )
			|| isAFunction( returnValue.then )
		) {
			returnValue.then( () => {
				timeoutId = null
				fnLastExecutedAt = Date.now()
			} )
		}
		else {
			timeoutId = null
			fnLastExecutedAt = Date.now()
		}

		return returnValue
	}

	return function ( this: any, ...args: any[] ) {
		fnArgs = args
		let thisInterval = isAFiniteNumber( this.interval ) ? ( this.interval * 1000 ) : interval

		if ( timeoutId ) {
			return
		}

		if (
			fnLastExecutedAt
		) {
			const timeSinceLastExecution = Date.now() - fnLastExecutedAt
			if ( timeSinceLastExecution < thisInterval ) {
				thisInterval = thisInterval - timeSinceLastExecution
			}
			else {
				// if time since last execution is greater than the interval,
				// then treat this as a new "session", or a "reset" of sorts
			}
		}

		timeoutId = setTimeout( () => runFunction.call( this, ...fnArgs ), thisInterval )

		// REVIEW PENDING
		// if ( leading ) {
		// 	return runFunction.call( this, ...fnArgs )
		// }
	}
}
