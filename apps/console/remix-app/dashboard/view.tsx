
import groupBy from "lodash.groupby"
import countBy from "lodash.countby"
import * as React from "react"
import { format } from "date-fns"
import { Bar } from "react-chartjs-2"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
} from "chart.js"

import { getIssues } from "@/utils/validation/get-issues"
import { isEmpty, isNotEmpty } from "@/utils/type-checking/meta"
import { isANonEmptyObject, isAnObject, isNotAnObject } from "@/utils/type-checking/object"
import { useMessagesContext } from "@/ui/react/context-providers/messages"
import { Field, FormProvider, useFormContext } from "@/ui/react/context-providers/form"
import Log from "@/ui/react/components/log"
import TextInput from "@/ui/react/components/forms/text-input"
import ButtonPrimary from "@/ui/react/components/buttons/button-primary"
import ValidationErrorMessages from "@/ui/react/components/forms/validation-error-messages"
import useFetcher from "@/ui/react/hooks/useFetcher"
import usePreviousValue from "@/ui/react/hooks/usePreviousState"
import { isAnArray } from "@/utils/type-checking/array"



ChartJS.register( {
	CategoryScale,
	LinearScale,
	BarElement,
} )





export default function DashboardView () {
	return <div className="pt-450 pb-350 container">
		<h2 className="pb-25 border-b border-neutral-2 h3 font-semibold font-serif text-black">Dashboard</h2>
		<MainContent className="mt-150" />
	</div>
}

function MainContent ( { className = "" } ) {
	const records = useTransactions()

	if ( records.length === 0 ) {
		return null
	}

	const { transactionsByDates, todaysStats } = getSuccessfulTransactionsByDates__And__TodaysStats( records )

	return <div className="mt-100 max-lg:space-y-150 lg:grid lg:grid-cols-3 lg:gap-x-100">
		<div className="col-span-1">
			<TodayStatistics data={ todaysStats } />
		</div>
		<div className="col-span-2 p-75 border-2 border-blue-1 shadow-[0_5px_5px_-2px] shadow-purple-1 rounded-50 hover:border-blue-2 hover:shadow-purple-2 transition-all duration-500">
			<h2 className="h4 font-serif">Successful Payments</h2>
			<PaymentChart dataset={ transactionsByDates } className="mt-100" />
		</div>
	</div>
}

function TodayStatistics ( { data } ) {
	return <div className="p-75 border-2 border-blue-1 shadow-[0_5px_5px_-2px] shadow-purple-1 rounded-50 hover:border-blue-2 hover:shadow-purple-2 transition-all duration-500">
		<h2 className="h4 font-serif">Today</h2>
		<div className="mt-100 grid grid-cols-2 max-md:gap-y-50 md:grid-cols-3 lg:grid-cols-2 lg:gap-y-50">
			<div>
				<h3 className="h2 md:h1 font-bold font-serif">{ data.success }</h3>
				<p className="h6 text-neutral-4">Successful</p>
			</div>
			<div>
				<h3 className="h2 md:h1 font-bold font-serif">{ data.failed }</h3>
				<p className="h6 text-neutral-4">Uncompleted</p>
			</div>
			<div>
				<h3 className="h2 md:h1 font-bold font-serif">{ data.new + data.initiated }</h3>
				<p className="h6 text-neutral-4">In-progress</p>
			</div>
		</div>
	</div>
}


function getSuccessfulTransactionsByDates__And__TodaysStats ( rawRecords ) {
	const records = rawRecords.map( el => {
		return {
			...el,
			createdAt: new Date( el.createdAt ),
			expiresOn: new Date( el.expiresOn ),
			updatedAt: new Date( el.updatedAt ),
		}
	} )

	const todaysDate = new Date
		todaysDate.setHours( 0 )
		todaysDate.setMinutes( 0 )
		todaysDate.setSeconds( 0 )
		todaysDate.setMilliseconds( 0 )

	const indexOfFirstTransactionThatIsNotFromToday = records.findIndex( e => e.createdAt < todaysDate )
		// ^ (the transactions are arranged in reverse chronological order)
	let transactionsOfToday
	if ( indexOfFirstTransactionThatIsNotFromToday === -1 ) {
		transactionsOfToday = records
	}
	else {
		transactionsOfToday = records.slice( 0, indexOfFirstTransactionThatIsNotFromToday )
	}

	const successfulTransactions = records.filter( e => e.status === "success" )

	const successfulTransactionsByDates = groupBy(
		successfulTransactions,
		function ( el ) {
			return el.createdAt.toLocaleString().slice( 0, 10 )
		}
	)

	let todaysStats = countBy( transactionsOfToday || [ ], el => el.status )
	todaysStats.new = todaysStats.new || 0
	todaysStats.initiated = todaysStats.initiated || 0
	todaysStats.failed = todaysStats.failed || 0
	todaysStats.success = todaysStats.success || 0

	return {
		transactionsByDates: successfulTransactionsByDates,
		todaysStats,
	}
}




/*
 |
 | Fetch all the transactions from a certain point in the past till the present
 | (recursively paginates through the responses until all the records are fetched)
 |
 |
 */
function useTransactions () {
	const fetcher = useFetcher()
	const _records = React.useRef( [ ] )
	const [ records, setRecords ] = React.useState( [ ] )
	const [ pageKey, setPageKey ] = React.useState( null )
	const [ complete, setComplete ] = React.useState( false )

	const [ fromDateString ] = React.useState( function () {
		const date = new Date
		return format( date.setDate( date.getDate() - 7 ), "yyyy-LL-dd" )
	} )

	const previousFetcherState = usePreviousValue( fetcher.state )

	React.useEffect( function () {
		let queryParams = [
			[ "limit", 1000 ],
			[ "dateRange.start", fromDateString ],
		]
		if ( isAnObject( pageKey ) && isANonEmptyObject( pageKey ) ) {
			queryParams = queryParams.concat( [ [ "page", encodeURIComponent( JSON.stringify( pageKey ) ) ] ] )
		}
		const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )

		fetcher.load( `/api/v1/transactions/list?_source=ui&${ queryParamString }` )
	}, [ pageKey ] )

	// Handle response, and queue next fetch
	React.useEffect( function () {
		if ( previousFetcherState === "loading" && fetcher.state !== "loading" ) {
			if ( isNotAnObject( fetcher.data ) ) {
				setComplete( true )
					// ^ confidently wrap things up
			}

			const { Items, LastEvaluatedKey } = fetcher.data
			if ( isAnArray( Items ) ) {
				_records.current = _records.current.concat( Items )
			}

			if ( isAnObject( LastEvaluatedKey ) ) {
				setPageKey( LastEvaluatedKey )
					// ^ queue next fetch
			}
			else {
				setComplete( true )
					// ^ confidently wrap things up
			}
		}
	}, [ fetcher.state ] )

	// Finish up
	React.useEffect( function () {
		if ( ! complete ) {
			return
		}
		setRecords( _records.current )
	}, [ complete ] )

	return records
}

function PaymentChart ( { dataset, className = "" } ) {
	if ( !dataset || !Object.keys( dataset ).length ) {
		return <></>
	}

	const options = {
		responsive: true
	}

	let dates = Object.keys( dataset )
	const lastDataPoint = dates.slice( -1 )[ 0 ]
	const firstDataPoint = dates[ 0 ]
	let dataIsConfinedToASingleYear = firstDataPoint.slice( -4 ) === lastDataPoint.slice( -4 )
	let labels
	if ( dataIsConfinedToASingleYear ) {
		labels = dates.map( l => l.slice( 0, -5 ) )	// strip away the year
	}
	else {
		labels = dates
	}

	const data = {
		labels,
		// labels: [ "13/08", "12/08", "11/08", "10/08", "09/08" ],
		datasets: [
			{
				label: "",
				data: Object.values( dataset ).map( e => e.length ),
				// data: [ 15, 27, 9, 14, 11 ],
				// backgroundColor: theme.backgroundColors.colorBackgroundPrimary,
				backgroundColor: "#8a5ce5",	// purple 2
				// backgroundColor: "#e2d6f8",	// purple 1
			}
		]
	}
	// return <div {...props}>
	// 	<h2 className="h2">Successful Payments</h2>
	// 	<Bar options={ options } data={ data } />
	// </div>
	return <Bar options={ options } data={ data } className={ className } />
}
