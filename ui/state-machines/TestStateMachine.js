
import { createMachine, assign } from "xstate"

import { waitFor } from "@ui/utils/time"
// import { logTransition } from "@ui/utils/xstate"

// xstate-ignore-next-line
export const TestStateMachine = createMachine( {
	id: "test",
	predictableActionArguments: true,
	preserveActionOrder: true,
	initial: "idle",
	context: {
		// underlying context provided by the UI
		// 	it is *not modified* by the state machine
		// 	it is only used when capturing logs
		forLogs: null,
		logScope: "transactions",
		timelog: [ ]
	},
	states: {
		"idle": {
			on: {
				START: {
					target: "started",
					actions: [
						assign( {
							timelog: ( context, event ) => context.timelog.concat( event )
						} )
					]
				}
			},
			entry: [
				logTransition( "user/idling" )
			],
			meta: {
				message: "chilling."
			},
			tags: [ "idle" ]
		},
		"started": {
			on: {
				DO_NOTHING: {
					// target: "end",
					actions: ( context, event ) => {
						console.log( `[${(new Date).getTime()}] doing nothing`, { context, event } )
					}
				},
				DO_SOMETHING: {
					target: "end",
					actions: [ logTransition( "user/do/something" ) ]
				},
				STOP: {
					target: "end",
					actions: [
						assign( {
							timelog: ( context, event ) => context.timelog.concat( event )
						} )
					]
				}
			},
			entry: [
				logTransition( "user/started" )
			],
			meta: {
				message: "doing."
			},
			tags: [ "doing" ]
		},
		"end": {
			final: true,
			entry: [
				logTransition( "user/finished" )
			],
			meta: {
				message: "chilling again."
			},
			tags: [ "idle" ]
		}
	}
} )


function logTransition ( name ) {
	return function ( context, event ) {
		console.log( `::${name}::`, { context, event } )
	}
}
