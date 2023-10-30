
import dayjs from "@/packages/dayjs"
import { useFetcher } from "@remix-run/react"
import * as React from "react"

import { Rupee } from "@ui/utils/currency"
import TransactionEventsTable from "./transaction-events-table"
import { useViewData } from "@/ui/react/context-providers/view"




const formatAsRupee = Rupee.createFormatter()





export default function TransactionEventsLogView () {
	const { transactionId, instituteId, refId } = useViewData()
	const transaction = useTransaction( transactionId, instituteId, refId )

	return <div className="pt-450 pb-350 container">
		{/* <h2 className="pb-25 border-b border-neutral-2 h3 font-semibold font-serif text-black">Transaction Event Log</h2> */}
		<h2 className="h3 font-semibold font-serif text-black capitalize">{ transaction.userName?.toLowerCase() }</h2>
		<p className="pb-25 border-b border-neutral-2 p text-neutral-4">
			{ dayjs( transaction.createdAt ).format( "hh:mm a DD/MM/YYYY" ) }
		</p>

		<TransactionEventsLog transaction={ transaction } className="mt-150" />
	</div>
}

function TransactionEventsLog ( { transaction, className = "" } ) {
	const { transactionId, instituteId, refId } = useViewData()
	const transactionEventRecords = useRecords( transactionId, instituteId, refId )

	// console.log( `<TransactionEventsLog />` )
	// console.log( transaction )

	return <div className={ className }>
		<TransactionInformation info={ transaction }  />

		<h3 className="mt-200 h4">Event Timeline</h3>
		<TransactionEventsTable records={ transactionEventRecords } className="mt-50 overflow-auto" />
	</div>
}



function TransactionInformation ( { info } ) {
	return <div className="c-12 md:c-7 lg:c-5">
		{/* <div className="mt-50">
			<p className="h4 capitalize">{ info.userName?.toLowerCase() }</p>
			<p className="p text-neutral-4">
				{ dayjs( info.createdAt ).format( "hh:mm a DD/MM/YYYY" ) }
			</p>
		</div> */}
		<h3 className="h4">Transaction Details</h3>
		<dl className="mt-50 space-y-50 md:space-y-75">
			<div className="md:flex justify-between p max-md:space-y-min">
				<dt className="font-semibold">Status</dt>
				<dd>{ info.status?.toLowerCase() === "failed" ? "uncomplete" : info.status }</dd>
			</div>
			<div className="md:flex justify-between p max-md:space-y-min">
				<dt className="font-semibold">Amount</dt>
				<dd>{ formatAsRupee( info.amount ) }</dd>
			</div>
			<div className="md:flex justify-between p max-md:space-y-min">
				<dt className="font-semibold">Reference Id</dt>
				<dd>{ info.refId }</dd>
			</div>
			<div className="md:flex justify-between p max-md:space-y-min">
				<dt className="font-semibold">PG Order Id</dt>
				<dd>{ info.pgOrderId }</dd>
			</div>
			<div className="md:flex justify-between p max-md:space-y-min">
				<dt className="font-semibold">Last Updated at</dt>
				<dd>{ dayjs( info.updatedAt ).format( "hh:mm a DD/MM/YYYY" ) }</dd>
			</div>
		</dl>
		{/* <p className="h5">{ formatAsRupee( info.amount ) }</p> */}
	</div>
}


function useTransaction ( transactionId, instituteId, refId ) {
	// const mountedBefore = useHasBeenMountedBefore()
	const fetcher = useFetcher()

	React.useEffect( function () {
		// if ( ! mountedBefore ) {
		// 	return
		// }
		let queryParams = [
			[ "_source", "ui" ],
			// [ "instituteId", instituteId ],
			[ "instituteId", "07ad046ec3f14eb1a99d9096db19404f" ],
				// ^ REMOVE THIS
			[ "refId", refId ],
		]
		const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
		const url = `/api/v1/transactions/${ transactionId }/` + "?" + queryParamString
		fetcher.load( url )
	}, [ transactionId, instituteId, refId ] )

	// return fetcher.data?.Items ?? [ ]
	return fetcher.data ?? [ ]
}

function useRecords ( transactionId, instituteId, refId ) {
	// const mountedBefore = useHasBeenMountedBefore()
	const fetcher = useFetcher()

	React.useEffect( function () {
		// if ( ! mountedBefore ) {
		// 	return
		// }
		let queryParams = [
			[ "_source", "ui" ],
			// [ "instituteId", instituteId ],
			[ "instituteId", "07ad046ec3f14eb1a99d9096db19404f" ],
				// ^ REMOVE THIS
			[ "refId", refId ],
		]
		const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
		const url = `/api/v1/transactions/${ transactionId }/events` + "?" + queryParamString
		fetcher.load( url )
	}, [ transactionId, instituteId, refId ] )

	return fetcher.data?.Items ?? [ ]
}
