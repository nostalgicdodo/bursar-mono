
import { createMachine, assign } from "xstate"
import { format } from "date-fns"

import {
	get,
	getQueryString,
} from "@ui/utils/http"





export const LogViewerMachine = createMachine( {
	id: "log-viewer",
	predictableActionArguments: true,
	preserveActionOrder: true,
	initial: "fetching-data",
	context: getDefaultContext(),
	states: {
		"idle": {
			on: {
				PAGE_THROUGH: {
					target: "fetching-data",
					actions: [ "contextSetPagination" ]
				},
				FILTER_UPDATE: {
					actions: [ "contextSetFilters" ]
				},
				FILTER_COMMIT: {
					target: "fetching-data",
					actions: [
						assign( { apiEndpoint: "/api/v1/transactions/list" } ),
						"contextResetPagination"
					]
				},
				SEARCH: {
					target: "fetching-data",
					actions: [
						assign( { apiEndpoint: "/api/v1/transactions/query" } ),
						"resetFiltration",
						"contextResetPagination",
						"contextSetFilters",
					]
				},
				EXPORT_DATA: {
					target: "exporting-data",
					actions: [
						assign( { apiEndpoint: "/api/v1/transactions/list" } ),
					]
				},
				RESET: {
					target: "fetching-data",
					actions: [
						assign( { apiEndpoint: "/api/v1/transactions/list" } ),
						"resetFiltration",
					]
				},
			},
			entry: [ "enableUI", "displayErrors" ],
			exit: [ "disableUI" ]
		},
		"fetching-data": {
			invoke: {
				src: "fetchData",
			},
			on: {
				REPORT_DATA_RECEIVED: {
					target: "idle",
					actions: [
						assign( ( context, event ) => {
							return {
								data: event.response?.Items,
								nextPageKey: event.response?.LastEvaluatedKey,
								isLastPage: event.response?.LastEvaluatedKey ? false : true
							}
						} ),
						"parseData",
						"storeCommittedFilters",
					]
				},
				REPORT_ERROR_RECEIVED: {
					target: "idle",
					actions: assign( {
						errors: ( context, event ) => event.response
					} )
				},
			},
			entry: [ "clearErrors" ],
		},
		"exporting-data": {
			invoke: {
				src: "exportData",
			},
			on: {
				REPORT_DATA_RECEIVED: {
					target: "idle",
				},
				REPORT_ERROR_RECEIVED: {
					target: "idle",
					actions: assign( {
						errors: ( context, event ) => event.response
					} )
				},
			},
			entry: [ "clearErrors" ],
		}
	}
}, {
	actions: {
		disableUI: function () {
			console.log( "Disable UI" )
		},
		enableUI: function () {
			console.log( "Enable UI" )
		},
		displayErrors: function ( context ) {
			if ( ! context.errors.length )
				return;
			console.log( "and the errors are...", context.errors )
		},
		clearErrors: assign( {
			errors: [ ]
		} ),
		contextSetFilters: assign( function ( context, event ) {
			if ( ! event.key )
				return;
			let { filterParams } = { ...context }
			filterParams = filterParams || { }
			filterParams[ event.key ] = valueMap[ event.key ]
				? valueMap[ event.key ]( event.value )
				: event.value
			return {
				filterParams
			}
		} ),
		contextResetPagination: assign( function ( context, event ) {
			return {
				pageKeys: [ ],
				nextPageKey: null,
			}
		} ),
		contextSetPagination: assign( function ( context, event ) {
			let { pageKeys, nextPageKey } = context
			if ( event.direction === "forwards" )
				pageKeys = pageKeys.concat( nextPageKey )
			else if ( event.direction === "backwards" ) {
				if ( pageKeys.length <= 1 ) {
					nextPageKey = null
				}
				else {
					nextPageKey = pageKeys.slice( -2 )[ 0 ] || null
				}
				pageKeys = pageKeys.slice( 0, -1 )
			}
			return {
				pageKeys,
				nextPageKey,
			}
		} ),
		resetFiltration: assign( getDefaultFiltrationContext ),
		parseData: assign( ( context, event ) => {
			const data = context.data.map( function ( el ) {
				return {
					...el,
					createdAt: new Date( el.createdAt ),
					expiresOn: new Date( el.expiresOn ),
					updatedAt: new Date( el.updatedAt ),
				}
			} )
			return { data }
		} ),
		storeCommittedFilters: assign( ( context ) => {
			return {
				committedFilterParams: context.filterParams
			}
		} )
	},
	services: {
		fetchData: ( context, event ) => ( send ) => {
			const queryParams = contextToQueryParams( {
				...context.filterParams,
				nextPageKey: context.nextPageKey
			}, event )

			const request = get( context.apiEndpoint, {
				q: queryParams
			} )
			request.promise
				.then( r => {
					send( { type: "REPORT_DATA_RECEIVED", response: r } )
				} )
				.catch( e => {
					send( { type: "REPORT_ERROR_RECEIVED", response: e } )
				} )
			return () => {
				request.abort()
			}
		},
		exportData: ( context, event ) => ( send ) => {
			const queryParams = contextToQueryParams( context.committedFilterParams, event )
			queryParams.export = true

			const url = context.apiEndpoint + "?" + getQueryString( queryParams )
			window.location.href = url
			send( { type: "REPORT_DATA_RECEIVED" } )
		},
	}
} )

function getDefaultContext () {
	return {
		apiEndpoint: "/api/v1/transactions/list",
		...getDefaultFiltrationContext(),
		data: [ ],
		errors: [ ],
	}
}

function getDefaultFiltrationContext () {
	return {
		filterParams: { },
		committedFilterParams: null,
		page: null,
		pageKeys: [ ],
		nextPageKey: null,
		isFirstPage: true,	// unused?
		isLastPage: false,
	}
}


const valueMap = {
	dateRange: function ( rangeText ) {
		if ( typeof rangeText !== "string" )
			return rangeText;
		const range = { start: null }
		const date = new Date
		if ( rangeText === "yesterday" ) {
			range.end = format( date, "yyyy-LL-dd" )
			date.setDate( date.getDate() - 1 )
		}
		if ( rangeText === "last-7-days" )
			date.setDate( date.getDate() - 7 )
		if ( rangeText === "last-30-days" )
			date.setDate( date.getDate() - 30 )
		if ( rangeText !== "" )
			range.start = format( date, "yyyy-LL-dd" )
		return range
	}
}

function contextToQueryParams ( context, event ) {
	let q = { }
	for ( let k in context ) {
		if ( ! contextToQueryMap[ k ] )
			continue;
		if ( contextToQueryMap[ k ] === true )
			q = { ...q, [ k ]: context[ k ] }
		else {
			const r = contextToQueryMap[ k ]( context[ k ], event )
			if ( typeof r === "object" && !Array.isArray( r ) )
				q = { ...q, ...r }
			else if ( ! [ null, void 0 ].includes( typeof r ) )
				q = { ...q, [ k ]: r }
		}
	}
	return q
}
const contextToQueryMap = {
	status: true,
	dateRange: v => {
		return {
			"dateRange.start": v.start,
			"dateRange.end": v.end,
		}
	},
	search: v => ({ "s": v }),
	nextPageKey: ( v, e ) => {
		if ( e.type !== "PAGE_THROUGH" )
			return { };
		if ( ! v?.id )
			return { };
		return { page: JSON.stringify( v ) }
	},
}
