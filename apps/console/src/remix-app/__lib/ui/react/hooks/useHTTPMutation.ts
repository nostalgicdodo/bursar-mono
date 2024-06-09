
import { useMutation } from "@tanstack/react-query"

import noOp, { noOpAsync } from "@/utilities/functions/no-op"
import { forADurationOf } from "@/utilities/clock/wait-for"
import OverridablePromise from "@/utilities/overridable-promise"
import http from "@/utilities/http"
import { isAFunction } from "@/utilities/type-checking/function"


type UseHTTPMutationProps = {
	action?: string;
	method: "POST";
	onSuccess?: ( response: any ) => void;
	onError?: ( e: any ) => void;
	onSettled?: ( response: any, e: any ) => void;
	delayResponseBy?: number;
}

export default function useHTTPMutation ( { action, method, delayResponseBy = 0, onSuccess, onError, onSettled }: UseHTTPMutationProps ) {
	const mutationPromise = new OverridablePromise()
		mutationPromise.catch( noOp )
			/**-> re move! */
			// ^ the catch handler

	return useMutation( {
		mutationKey: [ method, action ],
		mutationFn: ( ! [ "POST" ].includes( method ) ) ? noOpAsync : async ( payload ) => {
			const currentTime = Date.now()
			const { promise } = http.post( action ?? location.href, payload )
			let e = null
			try {
				await promise
			}
			catch ( _e ) {
				e = _e
			}
			const responseTime = parseFloat( ( ( Date.now() - currentTime ) / 1000 ).toFixed( 3 ) )
			const timeToWaitFor = delayResponseBy - responseTime
			if ( timeToWaitFor > 0 ) {
				await forADurationOf( timeToWaitFor )
			}

			if ( e ) {
				throw e
			}
			return promise
		},
		onSuccess ( response ) {
			mutationPromise.resolve( response )
			if ( isAFunction( onSuccess ) ) {
				onSuccess( response )
			}
		},
		onError ( e ) {
			mutationPromise.reject( e )
			if ( isAFunction( onError ) ) {
				onError( e )
			}
		},
		onSettled ( data, e ) {
			if ( isAFunction( onSettled ) ) {
				onSettled( data, e )
			}
		},
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
}

export type UseHTTPMutation = typeof useHTTPMutation
