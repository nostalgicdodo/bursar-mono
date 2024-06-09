
import { useRef } from "react"
import { useMutation } from "@tanstack/react-query"

import noOp, { noOpAsync } from "@/utilities/functions/no-op"
import { forADurationOf } from "@/utilities/clock/wait-for"
import OverridablePromise from "@/utilities/overridable-promise"
import http from "@/utils/http"
import { isAFunction } from "@/utilities/type-checking/function"
import { ObjectType } from "@/utilities/typescript-types/common-types"
import { isNotEmpty } from "@/utilities/type-checking/meta"


type UseHTTPMutationProps = {
	action?: string;
	method: "POST";
	options?: ObjectType;
	onSuccess?: ( response: any, variables: any, context: any ) => void;
	onError?: ( e: any, variables: any, context: any ) => void;
	onSettled?: ( response: any, e: any, variables: any, context: any ) => void;
	delayResponseBy?: number;
}

export default function useHTTPMutation ( { action, method, params, options = { }, delayResponseBy = 0, onSuccess, onError, onSettled }: UseHTTPMutationProps ) {
	const mutationPromise = new OverridablePromise()
		mutationPromise.catch( noOp )
			/**-> re move! */
			// ^ the catch handler
	// const paramsObject = useRef( params )

	const mutation = useMutation( {
		mutationKey: [ method, action ],
		mutationFn: ( ! [ "POST" ].includes( method ) ) ? noOpAsync : async ( { payload, params } ) => {
			const currentTime = Date.now()
			const { promise } = http.post(
				action ?? location.href,
				payload,
				{ ...options, q: params }
			)
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
		onSuccess ( response, { payload, ...other }, context ) {
			mutationPromise.resolve( response )
			if ( isAFunction( onSuccess ) ) {
				onSuccess( response, payload, { ...context, ...other } )
			}
		},
		onError ( e, { payload, ...other }, context ) {
			mutationPromise.reject( e )
			if ( isAFunction( onError ) ) {
				onError( e, payload, { ...context, ...other } )
			}
		},
		onSettled ( data, e, { payload, ...other }, context ) {
			if ( isAFunction( onSettled ) ) {
				onSettled( data, e, payload, { ...context, ...other } )
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

	return {
		...mutation,
		mutate ( payload?: ObjectType, params?: ObjectType, misc?: ObjectType ) {
			return mutation.mutate( { payload, params, misc } )
		}
	}
}

export type UseHTTPMutation = typeof useHTTPMutation
