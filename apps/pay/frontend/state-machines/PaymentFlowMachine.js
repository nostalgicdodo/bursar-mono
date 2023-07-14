
import { createMachine } from "xstate"

import { logTransition } from "@ui/utils/xstate"





export const PaymentFlowMachine = createMachine( {
	id: "payment-flow",
	predictableActionArguments: true,
	preserveActionOrder: true,
	initial: "determining-initial-state",
	schema: { },
	context: {
		// context provided by the consumer (of the machine)
		// 	*not modified* by the state machine
		// 	only for logging purposes
		forLogs: null,
		// this facilitates the log "actions" to work
		logScope: "transactions",

		paymentHasInitialised: false,
	},
	states: {
		"determining-initial-state": {
			always: [
				{ target: "closed", cond: "paymentHasInitialised" },
				{ target: "closed", cond: "sessionHasExpired" },
				{ target: "initial" },
			]
		},
		"initial": {
			on: {
				TRIGGER_PAYMENT_FLOW: {
					target: "initiating",
					actions: [ logTransition( "pg-payment-flow/trigger" ) ]
				}
			},
		},
		"initiating": {
			initial: "attempting",
			states: {
				"attempting": {
					on: {
						REPORT_INITIATE_ERROR: "error"
					},
				},
				"error": {
					entry: [ logTransition( "pg-payment-flow/trigger/error" ) ]
				},
			},
			on: {
				REPORT_INITIATE_SUCCESS: {
					target: "#payment-flow.in-session",
					// target: "done",
				},
			},
			// onDone: "in-session"
		},
		"in-session": {
			// invoke: {
			// 	src: () => send => pollUntilPaymentIsResolved( send )
			// },
			on: {
				// RESOLVED: "closing",
				CLOSE: "closed",
			},
			entry: [ logTransition( "pg-payment-flow/in-session" ) ]
		},
		// "closing": {},
		"closed": {
			final: true
		},
		"terminated": {
			final: true
		},
	},
	on: {
		TERMINATE_PAYMENT: {
			target: "terminated",
			actions: [ logTransition( "ui/payment-session/terminate" ) ]
		}
	}
}, {
	guards: {
		paymentHasInitialised: context => {
			return context.paymentHasInitialised
		},
		sessionHasExpired: context => {
			return context.sessionExpiresOn <= Date.now()
		},
	}
} )
