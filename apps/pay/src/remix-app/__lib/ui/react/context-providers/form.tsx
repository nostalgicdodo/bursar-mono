
/**
 |
 | Form Context
 |
 |
 */

import * as React from "react"
import { useQuery, useMutation } from "@tanstack/react-query"

import type { FunctionType } from "@/utilities/typescript-types/common-types"

import { isEmpty } from "@/utilities/type-checking/meta"
import { isANonEmptyObject, isAnEmptyObject } from "@/utilities/type-checking/object"
import { isANonEmptyArray } from "@/utilities/type-checking/array"

import { smoothScrollTo } from "@/ui/scrolling"
import createFineGrainedStoreContext from "./fine-grained-store-context"
import Log from "@/ui/react/components/log"
import noOp, { noOpAsync } from "@/utilities/functions/no-op"
import http from "@/utils/http"
import { forADurationOf } from "@/utilities/clock/wait-for"
import useHTTPMutation from "@/ui/react/hooks/useHTTPMutation"
import useToggle from "@/ui/react/hooks/useToggle"
import { isAFunction } from "@/utilities/type-checking/function"
import usePartialState from "../hooks/usePartialState"



type FormProviderProps = Partial<{
	action: string;
	method: "GET" | "POST";
	initial: Record<string, unknown>;
	onIssue: () => {};
	validations: any[];
	delayResponseBy: number;
	/**-> to doi! */
	// the submitHandler function types needs to take a `this` context and a second `state` argument
	submitHandler: React.ComponentProps<"form">[ "onSubmit" ]
	submitOnEnter: boolean;
	scrollToError: boolean;
	onResponse: ( responseData: any ) => void;
	children: React.ReactNode | ( ( args: FormContext ) => React.ReactNode );
}>
export type FormContext = {
	disabled: boolean;
	submittedSuccessfully: boolean;
	fieldInstances: ReturnType<typeof React.useRef<string[]>>;
	method: FormProviderProps[ "method" ];
	action?: FormProviderProps[ "action" ];
	state: any;
	useFormState: ReturnType<typeof createFineGrainedStoreContext>[ "useStoreContext" ];
	resetFormState: ReturnType<typeof createFineGrainedStoreContext>[ "resetStoreContext" ];
	query: ReturnType<typeof useQuery> & { fetch: ( params: Record<string, unknown> ) => ReturnType<ReturnType<typeof useQuery>[ "refetch" ]> };
	mutation: ReturnType<typeof useMutation<any, unknown, void, unknown>>;
	onSubmit: ReturnType<typeof createFormSubmitHandler>;
	issues: Record<string, string[]>;
	setIssues: ReturnType<typeof React.useState<Record<string, string[]>>>[ 1 ];
	issueHandler: FunctionType;
}

const FormContext = React.createContext<FormContext | null>( {
	disabled: false,
	useFormState: ( name ) => [ null, noOp, noOp ],
} )
FormContext.displayName = "FormContext"

export const FormProvider = React.forwardRef( function FormProvider ( { method = "GET", action, initial, delayResponseBy = 0, submitHandler, onResponse, onIssue, children }: FormProviderProps, ref ) {
	const {
		FineGrainedStoreProvider,
		useStoreContext,
		resetStoreContext
	} = React.useMemo( () => createFineGrainedStoreContext( initial ?? void 0 ), [ ] )

	return <FineGrainedStoreProvider>
		<InternalFormContextProvider method={ method } action={ action } initial={ initial } submitHandler={ submitHandler } onResponse={ onResponse } delayResponseBy={ delayResponseBy } onIssue={ onIssue } storeContext={{ useStoreContext, resetStoreContext }} ref={ ref }>
			{ children }
		</InternalFormContextProvider>
	</FineGrainedStoreProvider>
} )

type InternalFormProviderProps = FormProviderProps & {
	storeContext: Omit<ReturnType<typeof createFineGrainedStoreContext>, "FineGrainedStoreProvider">
}
export const InternalFormContextProvider = React.forwardRef( function InternalFormContextProvider ( { method = "GET", action, initial, delayResponseBy = 0, submitHandler, onResponse, onIssue, storeContext, children }: InternalFormProviderProps, ref ) {
	const [ state, ] = storeContext.useStoreContext()
	// delayResponseBy = delayResponseBy * 1000
	// console.log( { delayResponseBy } )
	const requestPayload = React.useRef( state )
	const fieldInstances = React.useRef<string[]>( [ ] )
	const issueHandler = useOnIssue( onIssue, { fieldInstances } )
	const [ issues, setIssues ] = React.useState<Record<string, string[]>>( { } )
	const [ submittedSuccessfully, setSubmittedSuccessfully ] = React.useState( false )


	/*
	 | Submission request handles
	 |
	 */
	// const queryClient = useQueryClient()
	/**-> to doi! */
	// On unmount, the requests have to be cancelled/aborted
	const query = useQuery( {
		queryKey: [ method, action ?? ".", state ],
		queryFn: ( ! [ "GET", "HEAD" ].includes( method ) ) ? noOp : async ( context ) => {
			const currentTime = Date.now()
			const { promise, abort } = http.get( action ?? location.href, { q: requestPayload.current } )
			let response
			try {
				response = await promise
			}
			catch ( e ) {
				response = e
			}

			const responseTime = parseFloat( ( ( Date.now() - currentTime ) / 1000 ).toFixed( 3 ) )
			const timeToWaitFor = delayResponseBy - responseTime
			if ( timeToWaitFor > 0 ) {
				await forADurationOf( timeToWaitFor )
			}

			// Response handling
			if ( isANonEmptyObject( response.issues ) ) {
				setIssues( response.issues )
				issueHandler( response.issues )
			}
			else {
				setSubmittedSuccessfully( true )
			}

			if ( isAFunction( onResponse ) ) {
				onResponse.call( { fieldInstances, focusField }, response )
			}

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
	const mutation = useHTTPMutation( {
		method,
		action,
		delayResponseBy,
		onSuccess ( response ) {
			setSubmittedSuccessfully( true )
			if ( isAFunction( onResponse ) ) {
				onResponse.call( { fieldInstances, focusField }, response )
			}
		},
		onError ( e ) {
			if ( isANonEmptyObject( e.issues ) ) {
				setIssues( e.issues )
				issueHandler( e.issues )
			}

			if ( isAFunction( onResponse ) ) {
				onResponse.call( { fieldInstances, focusField }, e )
			}
		},
	} )

	const isSubmitting = method === "GET" ? query.fetchStatus !== "idle" : mutation.isLoading
	const [ isDisabled, { setOff: setIsEnabled, setOn: setIsDisabled } ] = useToggle()
	const disabled = isDisabled || ( method === "GET" ? query.fetchStatus !== "idle" : mutation.isLoading )

	let contextValue: FormContext = {
		isSubmitting,
		submittedSuccessfully,
		disabled,
		fieldInstances,
		method,
		action,
		state,
		useStoreContext: storeContext.useStoreContext,
		resetStoreContext: storeContext.resetStoreContext,
		useFormState: storeContext.useStoreContext,
		resetFormState: storeContext.resetStoreContext,
		// query,
		query: React.useMemo( () => ({
			...query,
			fetch ( params ) {
				requestPayload.current = params
				return query.refetch()
			}
		}), [ ] ),
		mutation,
		issues,
		setIssues,
		issueHandler,
		focusField,
		enable: setIsEnabled,
		disable: setIsDisabled,
		// Form: React.useCallback( ({ children, ...props }) => <form onSubmit={ createFormSubmitHandler( submitHandler ?? noOp ) } { ...props }>{ children }</form>, [ ] )
	}
	contextValue.onSubmit = createFormSubmitHandler.call( contextValue, submitHandler ?? defaultSubmitHandler )


	React.useImperativeHandle( ref, function () {
		return {
			state,
			reset: storeContext.resetStoreContext,
			setIsDisabled,
			disable: setIsDisabled,
				// ^ alias for `setIsDisabled`
			setIsEnabled,
			enable: setIsEnabled,
				// ^ alias for `setIsEnabled`

			setIssues,
			issueHandler,
			// reset () {
			// 	storeContext.resetStoreContext()
			// },
			// responseData,
		}
	}, [ ] )





	return <FormContext.Provider value={ contextValue }>
		{ isAFunction( children ) ? children( contextValue ) : children }
	</FormContext.Provider>
} )

export function useFormContext () {
	const context = React.useContext( FormContext )
	if ( ! context ) {
		throw new Error( "This code must be wrapped within a FormProvider." )
	}
	return context
}




/*
 |
 | Helpers
 |
 |
 */
export function LogFormState ( { className = "" } ) {
	const { state, useFormState } = useFormContext()
	useFormState()

	return <Log data={ state } className={ className } />
}

function defaultSubmitHandler ( this: FormContext, event, state ) {
	if ( this.method === "POST" ) {
		this.mutation.mutate( state )
	}
	else if ( this.method === "GET" ) {
		this.query.fetch( state )
	}
}

function createFormSubmitHandler ( this: FormContext, fn ) {
	const thisFunctionContext = this
	return function ( event ) {
		event?.preventDefault()
			// ^ there are scenarios where the submit handler is invoked manually, hence the check on the `event` object

		// Blur any of form input elements so that the latest state can be persisted
		const currentlyActiveElement = document.activeElement
		if ( document.activeElement ) {
			document.activeElement.blur()
		}

		window.setTimeout( function () {
			// Re-focus the element that was under focus prior to submission
			if ( currentlyActiveElement ) {
				currentlyActiveElement.focus()
			}

			// If user un-disables the submit button (through devtools)
			// 	and then clicks it again, prevent re-submission.
			if (
				thisFunctionContext.query.fetchStatus !== "idle"
				|| thisFunctionContext.mutation.isLoading
			) {
				return
			}

			// return fn.call( thisFunctionContext, event, thisFunctionContext.stateRef.current )
			return fn.call( thisFunctionContext, event, thisFunctionContext.state )
		}, 1 )
	}
}

/*
 |
 | Form field
 | This component is a superficial wrapper intended to wrap over all the markup involved in respresenting a single field.
 | 	It tracks the order/sequence of all the form field instances which is used in auto-scrolling to the **first form field that has an issue** (in the event where there are issues)
 |
 |
 */
type FieldProps<N extends string> = {
	name: N;
	children: (
		name: N,
		fieldId: `f_${ N }`,
		inputId: `i_${ N }`,
		ref: any,
	) => React.ReactNode;
}
export function Field<T extends string> ( { name, children }: FieldProps<T> ): any {
	const attributeValue = name.replaceAll( ".", "_" )
	const ref = React.useRef()
	const { fieldInstances } = useFormContext()
	React.useEffect( function () {
		fieldInstances.current = fieldInstances.current.concat( name )
		return function () {
			const index = fieldInstances.current.findIndex( e => e === name )
			fieldInstances.current = fieldInstances.current.slice( 0, index ).concat( fieldInstances.current.slice( index + 1 ) )
		}
	} )
	return children( name, `f_${ attributeValue }`, `i_${ attributeValue }`, ref )
}


function useOnIssue ( onIssue, { fieldInstances } ) {
	return React.useCallback( function ( issues ) {
		if ( isAFunction( onIssue ) ) {
			return onIssue( issues, fieldInstances.current, {
				focusField,
				scrollToField,
			} )
		}


		if ( isEmpty( onIssue ) ) {
			onIssue = { focus: true, scroll: true }
		}

		const focus = onIssue.focus ?? true
		const scroll = onIssue.scroll ?? true

		if ( !focus && !scroll ) {
			return
		}
		if ( isAnEmptyObject( issues ) ) {
			return
		}
		for ( let field of fieldInstances.current ) {
			if ( Array.isArray( issues[ field ] ) && isANonEmptyArray( issues[ field ] ) ) {
				if ( scroll ) {
					scrollToField( field )
					if ( focus ) {
						setTimeout( function () {
							focusField( field )
						}, 250 )
					}
				}
				else if ( focus ) {
					focusField( field )
				}
					// ^ sometimes, focusing on an element short-circuits any ongoing smooth-scroll
				return
			}
		}
	}, [ ] )
}

export function scrollToField ( name ) {
	const attributeValue = "f_" + name.replaceAll( ".", "_" )
	smoothScrollTo( attributeValue )
}

function focusField ( name ) {
	const attributeValue = "i_" + name.replaceAll( ".", "_" )
	document.getElementById( attributeValue )?.focus()
}
