
import dayjs from "dayjs"
import { useFetcher } from "@remix-run/react"
import * as React from "react"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import ButtonSecondary from "@/ui/react/components/buttons/button-secondary"

import TransactionsTable from "./transactions-table"
import FiltrationForm from "./filtration-form"
import { isEmpty, isNotEmpty } from "@/utilities/type-checking/meta"
import SearchFormContainer from "./search-form"
import { isAnEmptyObject, isAnObject, isANonEmptyObject } from "@/utilities/type-checking/object"
import Pagination from "./pagination"
import { isStringBlank } from "@/utilities/type-checking/strings/identity"





export default function TransactionLogView () {
	return <div className="pt-450 pb-350 container">
		<h2 className="pb-25 border-b border-neutral-2 h3 font-semibold font-serif text-black">Log</h2>
		<TransactionLogs className="mt-150" />
	</div>
}

function TransactionLogs ( { className = "" } ) {
	const mountedBefore = useHasBeenMountedBefore()
	// const { data } = useRouteData()
	// const [ records, setRecords ] = React.useState( [ ] )
	const [ filterParams, setFilterParams ] = React.useState( { } )
	const [ searchParams, setSearchParams ] = React.useState( { } )
	const [ pageKeys, setPageKeys ] = React.useState( [ ] )
	const [ currentPageKey, setCurrentPageKey ] = React.useState( null )
	const [ isLastPage, setIsLastPage ] = React.useState( false )

	const filrationFormRef = React.useRef()
	const searchFormRef = React.useRef()

	const resetFilrationForm = function () {
		filrationFormRef.current.reset();
		setFilterParams( v => {
			return isANonEmptyObject( v ) ? { } : v
		} )
		setPageKeys( [ ] )
	}
	const resetSearchForm = function () {
		searchFormRef.current.reset();
		setSearchParams( v => {
			return isANonEmptyObject( v ) ? { } : v
		} )
		setPageKeys( [ ] )
	}

	const { records, nextPageKey } = useRecords( filterParams, searchParams, currentPageKey )

	React.useEffect( function () {
		setFilterParams( filrationFormRef.current.state )
	}, [ ] )

	React.useEffect( function () {
		if ( ! mountedBefore ) {
			return
		}
		if ( isEmpty( nextPageKey ) ) {
			setIsLastPage( true )
		}
		else {
			setPageKeys( v => v.concat( nextPageKey ) )
		}
	}, [ nextPageKey ] )

	const exportURL = React.useMemo( function () {
		let queryParams = [
			[ "export", true ],
			[ "instituteId", "07ad046ec3f14eb1a99d9096db19404f" ],
				// ^ REMOVE THIS
			[ "status", filterParams.status ],
			[ "dateRange.start", filterParams.dateRange?.start && dayjs( filterParams.dateRange.start ).format( "YYYY-MM-DD" ) ],
			[ "dateRange.end", filterParams.dateRange?.end && dayjs( filterParams.dateRange.end ).format( "YYYY-MM-DD" ) ],
		]
		const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
		const url = "/api/v1/transactions/list"
		return isStringBlank( queryParamString ) ? url : ( url + "?" + queryParamString )
	}, [ filterParams ] )

	// console.log( `<TransactionLogs />` )

	return <div className={ className }>

		<FiltrationForm
			ref={ filrationFormRef }
			onCommit={ state => { setFilterParams( { ...state } ); resetSearchForm() } }
			onReset={ resetFilrationForm }
		/>

		<hr className="lg:hidden mt-75 border-neutral-1" />

		<SearchFormContainer
			ref={ searchFormRef }
			className="mt-50"
			onCommit={ state => { setSearchParams( { ...state } ); resetFilrationForm() } }
			onReset={ resetSearchForm }
		/>

		<hr className="mt-75 border-neutral-1" />

		<div className="mt-50 text-right">
			{/* <Link to={ exportURL } className="inline-block space-x-min">
				<ArrowDownTrayIcon className="w-75" />
				<span>Export CSV</span>
			</Link> */}
			<ButtonSecondary as="a" href={ exportURL } case="normal" className="space-x-min">
				<ArrowDownTrayIcon className="w-75" />
				<span>Export CSV</span>
			</ButtonSecondary>
		</div>

		<TransactionsTable records={ records } className="mt-250 overflow-auto" />

		<Pagination
			current={ pageKeys.length }
			onNext={ () => setCurrentPageKey( pageKeys[ pageKeys.length - 1 ] ) }
			onPrev={ () => {
				const pageKey = pageKeys[ pageKeys.length - 1 - 2 ]
				setPageKeys( v => v.slice( 0, -2 ) )
				setCurrentPageKey( pageKey )
			} }
			lastPage={ isLastPage }
			className="mt-50"
		/>

	</div>
}



function useRecords ( filterParams, searchParams, pageKey ) {
	const fetcher = useFetcher()
	React.useEffect( function () {
		if ( ! isAnEmptyObject( searchParams ) ) {
			let queryParams = [
				[ "s", searchParams.searchQuery ],
			]
			const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
			fetcher.load( `/api/v1/transactions/query?_source=ui&${ queryParamString }` )
		}
		// else if ( ! isAnEmptyObject( filterParams ) ) {
		else {
			let queryParams = [
				[ "instituteId", "07ad046ec3f14eb1a99d9096db19404f" ],
					// ^ REMOVE THIS
				[ "status", filterParams.status ],
				[ "dateRange.start", filterParams.dateRange?.start && dayjs( filterParams.dateRange.start ).format( "YYYY-MM-DD" ) ],
				[ "dateRange.end", filterParams.dateRange?.end && dayjs( filterParams.dateRange.end ).format( "YYYY-MM-DD" ) ],
			]
			if ( isNotEmpty( pageKey?.id ) ) {
				queryParams = queryParams.concat( [ [ "page", encodeURIComponent( JSON.stringify( pageKey ) ) ] ] )
			}
			const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
			fetcher.load( `/api/v1/transactions/list?_source=ui&${ queryParamString }` )
		}
	}, [ filterParams, searchParams, pageKey ] )

	// return fetcher.data?.Items ?? [ ]
	return ( isAnObject( fetcher.data ) && isANonEmptyObject( fetcher.data ) ) ? {
		records: fetcher.data.Items,
		nextPageKey: fetcher.data.LastEvaluatedKey,
	} : {
		records: [ ],
		nextPageKey: null,
	}
}
