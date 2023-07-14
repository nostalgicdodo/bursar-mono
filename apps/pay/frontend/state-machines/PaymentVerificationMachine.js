
import { createMachine, assign } from "xstate"

import { logTransition } from "@ui/utils/xstate"





export const PaymentVerificationMachine = createMachine( {
	id: "payment-verification",
	predictableActionArguments: true,
	preserveActionOrder: true,
	initial: "idle",
	schema: { },
	context: {
		// context provided by the consumer (of the machine)
		// 	*not modified* by the state machine
		// 	only for logging purposes
		forLogs: null,
		// this facilitates the log "actions" to work
		logScope: "transactions",
		sessionExpiresOn: null,
		orderCreatedAt: null,
		verificationAttempts: 0,
		mostRecentOrderStatus: null,
	},
	states: {
		"idle": {
			on: {
				INITIATE: "waiting"
			}
		},
		"waiting": {
			after: {
				5000: [
					{ target: "verifying", cond: "withinThresholdTime" },
					{ target: "verified" }
				]
			},
		},
		"verifying": {
			invoke: {
				src: ( context ) => send => {
					// let transitionedAway = false
					getTransactionStatus().then( r => {
						// if ( transitionedAway )
						// 	return;
						if (
							!r
							|| ( !r.status || r.status !== "success" )
						)
							return send( { type: "UNRESOLVED", data: { status: r?.status } } )

						return send( { type: "RESOLVED", data: { status: r.status } } )
					} )
					return () => {
						// transitionedAway = true
					}
				}
			},
			on: {
				UNRESOLVED: "waiting",
				RESOLVED: "verified",
			},
			exit: assign( {
				verificationAttempts: context => context.verificationAttempts + 1,
				mostRecentOrderStatus: ( context, event ) => event.data.status
			} )
		},
		"verified": {
			final: true,
			entry: [
				logTransition( "merchant-redirect" )
			]
		},
	},
}, {
	guards: {
		withinThresholdTime: function ( context ) {
			const timeRemainingInSession = context.sessionExpiresOn - ( new Date )
			return timeRemainingInSession > 0
		}
	}
} )

async function getTransactionStatus () {
	try {
		const unparsedResponse = await fetch( "/api/v1/transactions/status" )
		const response = await unparsedResponse.json()
		return Promise.resolve( response )
	} catch ( e ) {
		return Promise.resolve( null )
	}
}
