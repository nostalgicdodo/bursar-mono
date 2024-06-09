
/*
 |
 | useHTTPMutation
 |
 | An HTTP mutation (i.e. anything but a GET request) hook
 | - Wraps over TanStack Query's useMutation hook
 | - Exposes an API to register event handlers (onSuccess, onError, onSettled)
 |		at the hook level and at a per-mutation level
 |
 */

import { useMutation } from "@tanstack/react-query"

import noOp, { noOpAsync } from "@/utilities/functions/no-op"
import { forADurationOf } from "@/utilities/clock/wait-for"
import OverridablePromise from "@/utilities/overridable-promise"
import http from "@/utils/http"


type UseNewHTTPMutationProps = Partial<{
	url: string;
	params: ObjectType;
	method: "POST";
	options: ObjectType;
	delayResponseBy: number;
	// Event handlers
	onMutate: ( args: Partial<{ url: string, params: ObjectType, payload: ObjectType }> ) => void;
	onSuccess: ( response: any, variables: any, context: any ) => void;
	onError: ( e: any, variables: any, context: any ) => void;
	onSettled: ( response: any, e: any, variables: any, context: any ) => void;
}>
type MutateParameters = [
	payload: ObjectType,
	requestAttributesAndLifecycleMethods: Partial<{
		url: string;
		params: ObjectType;
		// Event handlers
		onMutate: ( args: Partial<{ url: string, params: ObjectType, payload: ObjectType }> ) => void;
		onSuccess: ( response: any, variables: any, context: any ) => void;
		onError: ( e: any, variables: any, context: any ) => void;
		onSettled: ( response: any, e: any, variables: any, context: any ) => void;
	}>,
	additionalContext: ObjectType,
]

export default function useNewHTTPMutation ( { url: url__hookLevel, method = "POST", params = { }, options = { }, delayResponseBy = 0, onMutate, onSuccess, onError, onSettled }: UseNewHTTPMutationProps ) {
	const mutationPromise = new OverridablePromise()
		mutationPromise.catch( noOp )
			/**-> re move! */
			// ^ the catch handler

	const mutation = useMutation( {
		mutationKey: [ method, url__hookLevel, params ],
		mutationFn: ( ! [ "POST" ].includes( method ) ) ? noOpAsync : async ( [ { url, params, payload } ] ) => {
			const currentTime = Date.now()
			const resolvedURL = url ?? url__hookLevel ?? location.href

			// 1. Create a new promise that encapsulates the HTTP request
			const { promise } = http.post(
				resolvedURL,
				payload,
				{ ...options, q: params }
			)
			// 2. Await the promise
			let e = null
			try {
				await promise
			}
			catch ( _e ) {
				e = _e
			}

			// 3. Delay the return of the promise value if a delay was specified
			const responseTime = parseFloat( ( ( Date.now() - currentTime ) / 1000 ).toFixed( 3 ) )
			const timeToWaitFor = delayResponseBy - responseTime
			if ( timeToWaitFor > 0 ) {
				await forADurationOf( timeToWaitFor )
			}

			// 4. Finally, return the result of the promise, or throw if an error was encountered
			if ( e ) {
				throw e
			}
			return promise
		},

		/* _____
		 | Event handlers
		 |
		 */
		onMutate ( [ { url, params, payload }, eventHandlers ] ) {
			onMutate?.( { url, params, payload } )
			eventHandlers.onMutate?.( { url, params, payload } )
		},
		onSuccess ( response, [ request, eventHandlers, additionalContext ], _context ) {
			mutationPromise.resolve( response )

			const context = { request, ..._context, ...additionalContext }
			onSuccess?.( response, request.payload, context )
			eventHandlers.onSuccess?.( response, request.payload, context )
		},
		onError ( e, [ request, eventHandlers, additionalContext ], _context ) {
			mutationPromise.reject( e )

			const context = { request, ..._context, ...additionalContext }
			onError?.( e, request.payload, context )
			eventHandlers.onError?.( e, request.payload, context )
		},
		onSettled ( data, e, [ request, eventHandlers, additionalContext ], _context ) {
			const context = { request, ..._context, ...additionalContext }
			onSettled?.( data, e, request.payload, context )
			eventHandlers.onSettled?.( data, e, request.payload, context )
		},

		/* _____
		 | Retry policy
		 |
		 */
		retry: false,
		// retry ( failureCount, e ) {
		// 	if ( isANonEmptyObject( e.issues ) ) {
		// 		return false
		// 	}
		// 	if ( failureCount < 3 ) {
		// 		return true
		// 	}
		// },
	} )

	// Return the mutation object (from TanStack Query) but with a modified `mutate` method
	return {
		...mutation,
		mutate ( ...[
				payload,
				{ url, params, onMutate, onSuccess, onError, onSettled },
				// ^ request attributes and lifecycle methods
				additionalContext
				// ^ additional context
			]: MutateParameters
		) {
			const request = { url, params, payload }
			const eventHandlers = { onMutate, onSuccess, onError, onSettled }
			return mutation.mutate( [ request, eventHandlers, additionalContext ] )
		}
	}
}

export type UseNewHTTPMutation = typeof useNewHTTPMutation
