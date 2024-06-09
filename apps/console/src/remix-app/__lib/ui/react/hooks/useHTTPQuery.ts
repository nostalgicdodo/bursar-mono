
import * as React from "react"
import { useQuery } from "@tanstack/react-query"

import type { ObjectType } from "@/utilities/typescript-types/common-types"

import noOp, { noOpAsync } from "@/utilities/functions/no-op"
import { forADurationOf } from "@/utilities/clock/wait-for"
import OverridablePromise from "@/utilities/overridable-promise"
import http from "@/utilities/http"
import { isAFunction } from "@/utilities/type-checking/function"
import { isANonEmptyObject } from "@/utilities/type-checking/object"
import { isNotEmpty } from "@/utilities/type-checking/meta"


type UseHTTPQueryProps = {
	action: string;
	params: ObjectType,
	method: "GET" | "HEAD";
	onSuccess: ( response: any ) => void;
	onError: ( e: any ) => void;
	onSettled: ( response: any, e: any ) => void;
	delayResponseBy: number;
}

export default function useHTTPQuery ( { action, method = "GET", params, delayResponseBy = 0, onSuccess, onError, onSettled }: Partial<UseHTTPQueryProps> ) {
	const queryPromise = new OverridablePromise()
		queryPromise.catch( noOp )
			/**-> re move! */
			// ^ the catch handler
	const paramsObject = React.useRef( params )

	const query = useQuery( {
		queryKey: [ method, action ],
		queryFn: ( ! [ "GET", "HEAD" ].includes( method ) ) ? noOpAsync : async ( context ) => {
			const currentTime = Date.now()
			const { promise } = http.get( action ?? location.href, { q: paramsObject.current } )
			let response
			let e = null
			try {
				response = await promise
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
				queryPromise.reject( e )
				if ( isANonEmptyObject( e.issues ) ) {
					if ( isAFunction( onError ) ) {
						onError( e )
					}
				}
			}
			if ( response ) {
				if ( isAFunction( onSuccess ) ) {
					onSuccess( response )
				}
			}
			if ( isAFunction( onSettled ) ) {
				onSettled( response, e )
			}

			paramsObject.current = { }

			return promise
		},
		enabled: false,
		retry: false,
		// retry ( failureCount, e ) {
		// 	if ( isANonEmptyObject( e.issues ) ) {
		// 		return false
		// 	}
		// 	if ( failureCount < 3 ) {
		// 		return true
		// 	}
		// },
		staleTime: 0,
			// ^ redundant because querying using the `refetch` method
			// 	ignores the `staleTime` value, but still, for sanity
	} )

	return {
		...query,
		fetch ( params ) {
			if ( isNotEmpty( params ) ) {
				paramsObject.current = params
			}
			return query.refetch()
		}
	}
}

export type UseHTTPQuery = typeof useHTTPQuery
