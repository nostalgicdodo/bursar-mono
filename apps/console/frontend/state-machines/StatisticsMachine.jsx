
import { groupBy, countBy } from "lodash"
import { createMachine, assign } from "xstate"
import { format } from "date-fns"

import { get } from "@ui/utils/http"





export const StatisticsMachine = createMachine( {
	id: "statistics",
	predictableActionArguments: true,
	preserveActionOrder: true,
	initial: "submitting-data",
	context: getDefaultContext(),
	states: {
		"idle": {
			on: {
				FILTER_UPDATE: {
					actions: [ "contextSetFilters", "contextSetFilterUncommitted" ]
				},
				FILTER_COMMIT: {
					target: "submitting-data",
					actions: [ "contextSetCommitted" ]
				},
				FILTER_RESET: {
					target: "submitting-data",
					actions: [ "resetFiltration", "contextSetCommitted" ]
				}
			},
			entry: [ "displayErrors", "contextSetFilterCommitted" ],
			exit: [ ]
		},
		"submitting-data": {
			invoke: {
				src: "submitData",
			},
			on: {
				REPORT_DATA_RECEIVED: {
					target: "idle",
					actions: [
						assign( {
							data: ( context, event ) => event.response?.Items,
							nextPageKey: ( context, event ) => event.response?.LastEvaluatedKey
						} ),
						"parseData",
						"setToContext__InterpretedData",
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
		}
	}
}, {
	actions: {
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
		contextSetFilterUncommitted: assign( {
			hasUncommittedChanges: true,
		} ),
		contextSetFilterCommitted: assign( {
			hasUncommittedChanges: false,
		} ),
		resetFiltration: assign( getDefaultFiltrationContext ),
		parseData: assign( ( context, event ) => {
			// the data returned includes date values as strings; those need to be parsed to Dates
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
		setToContext__InterpretedData: assign( ( context, event ) => {
			const todayDate = new Date;
				todayDate.setHours( 0 );
				todayDate.setMinutes( 0 );
				todayDate.setSeconds( 0 );
				todayDate.setMilliseconds( 0 );

			const indexOfFirstOrderThatIsNotFromToday = context.data.findIndex( e => e.createdAt < todayDate )
			let ordersOfToday
			if ( indexOfFirstOrderThatIsNotFromToday === -1 )
				ordersOfToday = context.data
			else
				ordersOfToday = context.data.slice( 0, indexOfFirstOrderThatIsNotFromToday )

			const successfulOrders = context.data.filter( e => e.status === "success" )

			const successfulOrdersByDates = groupBy(
				successfulOrders,
				function ( el ) {
					return el.createdAt.toLocaleString().slice( 0, 10 )
				}
			)
			const todayStats = countBy( ordersOfToday || [ ], el => el.status )
			return {
				ordersByDates: successfulOrdersByDates,
				todayStats,
			}
		} )
	},
	services: {
		submitData: ( context, event ) => ( send ) => {
			const queryParams = contextToQueryParams( {
				...context.filterParams,
				nextPageKey: context.nextPageKey,
				page: context.page,
			}, event )

			const request = get( context.baseAPIEndpoint, {
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
		}
	}
} )

function getDefaultContext () {
	return {
		baseAPIEndpoint: "/api/v1/transactions/list",
		...getDefaultFiltrationContext(),
		data: [ ],
		errors: [ ],
	}
}

function getDefaultFiltrationContext () {
	return {
		filterParams: {
			dateRange: {
				start: ( () => {
					const date = new Date
					date.setDate( date.getDate() - 7 )
					return format( date, "yyyy-LL-dd" )
				} )()
			}
		},
		hasUncommittedChanges: false,
		page: 1000,
		pageKeys: [ ],
		nextPageKey: null,
		isFirstPage: true,
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
	page: v => {
		return { limit: v }
	},
	dateRange: v => {
		return {
			"dateRange.start": v.start,
			"dateRange.end": v.end,
		}
	},
}
