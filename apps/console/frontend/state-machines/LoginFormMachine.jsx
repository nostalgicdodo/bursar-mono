
import { createMachine, assign } from "xstate"

import { get, post } from "@ui/utils/http"





export const LoginFormMachine = createMachine( {
	id: "form",
	predictableActionArguments: true,
	preserveActionOrder: true,
	initial: "idle",
	context: getDefaultContext(),
	states: {
		"idle": {
			on: {
				RESET: "resetting",
				SUBMIT: {
					target: "validating",
					actions: "storeFormData",
				},
			},
		},
		"validating": {
			entry: [
				"clearErrors"
			],
			always: [
				{ target: "submitting", cond: "submissionIsValid", actions: [ "prepareRequestPayload" ] },
				{ target: "idle" },
			],
		},
		"submitting": {
			entry: [
				// runs *after* the service is invoked
				"clearPreviousResponse",
			],
			invoke: {
				src: "submitData",
				// onDone: "parsing-response",
				// onError: "parsing-error",
			},
			on: {
				REPORT_RESPONSE_RECEIVED: "parsing-response",
				REPORT_REQUEST_ERROR: "parsing-error",
			},
		},
		"resetting": {
			entry: [ "resetForm", "resetContext" ],
			always: "idle",
		},
		"parsing-response": {
			entry: [ "parseResponse" ],
			after: {
				"1500": [
					{ target: "done", cond: "responseIsOkay" },
					{ target: "idle" }
				],
			}
		},
		"parsing-error": {
			entry: [ "parseError" ],
			after: { "1500": "idle" }
		},
		"done": {
			final: true
		},
	}
}, {
	guards: {
		submissionIsValid: ( context ) => {
			return true
		},
		responseIsOkay: ( context ) => {
			return context.response?.ok === true
		},
	},
	actions: {
		storeFormData: assign( {
			formData: ( context, event ) => {
				return event.data
			}
		} ),
		clearErrors: assign( {
			requestError: null,
			responseError: null,
		} ),
		prepareRequestPayload: assign( ( context, event ) => {
			let payload = { }
			const formData = context.formData

			payload = formData

			return {
				requestPayload: payload
			}
		} ),
		clearPreviousResponse: () => ({
			response: null,
		}),
		parseResponse: assign( ( context, event ) => {
			const response = event.response
			let responseError
			if ( response === null )
				responseError = context.genericErrorMessage
			else if ( typeof response !== "object" )
				responseError = context.genericErrorMessage
			else if ( !("ok" in response) )
				responseError = context.genericErrorMessage
			else if ( response.ok === false )
				responseError = "Either the email or password is incorrect. Please try again."
			else
				responseError = null

			return {
				response,
				responseError,
			}
		} ),
		parseError: assign( ( context, event ) => {
			return {
				requestError: event.e
			}
		} ),
		resetForm: ( context, event ) => {
			const formRef = context.formRef || event.formRef
			if ( ! ( formRef?.current instanceof window.HTMLFormElement ) )
				return;
			formRef.current.reset()
		},
		resetContext: assign( getDefaultContext ),
	},
	services: {
		submitData: ( context, event ) => ( send ) => {
			const url = context.formRef?.current?.action || window.location.href
			const method = context.formRef?.current?.method.toUpperCase() || "GET"
			let request
			if ( method === "GET" ) {
				request = get( url, { q: context.requestPayload } )
			}
			else {
				request = post( url, context.requestPayload, { redirect: "manual" } )
			}
			request.promise
				.then( r => {
					send( { type: "REPORT_RESPONSE_RECEIVED", response: r } )
				} )
				.catch( e => {
					send( { type: "REPORT_REQUEST_ERROR", e } )
				} )
			return () => {
				request.abort()
			}
		}
	}
} )

function getDefaultContext () {
	return {
		genericErrorMessage: "There seems to be an issue. Please try again in a few minutes.",
		formRef: null,
		formData: { },
		requestPayload: null,
		response: null,
		requestError: null,
		responseError: null,
	}
}
