
import dayjs from "@/packages/dayjs"
import * as React from "react"

import FiltrationForm from "./filtration-form"
import SearchForm from "./search-form"
import { isANonEmptyObject } from "@/utilities/type-checking/object"
import Log from "@/ui/react/components/log"
import { isEmpty, isNotEmpty } from "@/utilities/type-checking/meta"
import TransactionsTable from "./transactions-table"
import { useMessagesContext } from "@/ui/react/context-providers/messages"
import useHTTPQuery from "@/ui/react/hooks/useHTTPQuery"
import Pagination from "./pagination"
import ExportButton from "./export-button"





export default function TransactionLogView () {
	return <div className="pt-450 pb-350 container">
		<h2 className="pb-25 border-b border-neutral-2 h3 font-semibold font-serif text-black">Log</h2>
		<TransactionLogs className="mt-150" />
	</div>
}

function TransactionLogs ( { className = "" } ) {
	const {
		setActiveSearchWidget,

		setCurrentPageKey,
		pageKeys,
		setPageKeys,

		pageNumber,
		setPageNumber,
		isLastPage,

		filterParams,
			setFilterParams,
			resetFiltrationForm,

		// searchParams,
			setSearchParams,
			resetSearchForm,

		records,
		isSearching,
	} = useSearch()

	const filtrationFormRef = React.useRef()
	const searchFormRef = React.useRef()

	return <div className={ className }>

		<FiltrationForm
			onSubmit={ formRef => {
				setFilterParams( { ...formRef.current.state } )
				searchFormRef.current.reset()
				resetSearchForm()
				setActiveSearchWidget( "filtration" )
				// Clear out the pagination state
				setPageKeys( [ ] )
				setCurrentPageKey( null )
				setPageNumber( 1 )
			} }
			onReset={ resetFiltrationForm }
			ref={ filtrationFormRef }
		/>

		<hr className="lg:hidden mt-75 border-neutral-1" />

		<SearchForm
			onSubmit={ formRef => {
				setSearchParams( { ...formRef.current.state } )
				filtrationFormRef.current.reset()
				resetFiltrationForm()
				setActiveSearchWidget( "search-by-student-id" )
				// Clear out the pagination state
				setPageKeys( [ ] )
				setCurrentPageKey( null )
				setPageNumber( 1 )
			} }
			onReset={ resetSearchForm }
			className="mt-50"
			ref={ searchFormRef }
		/>

		<hr className="mt-75 border-neutral-1" />

		<ExportButton filterParams={ filterParams } className="mt-50" />

		<TransactionsTable records={ records } className="mt-250 overflow-auto" />

		<Pagination
			current={ pageNumber }
			onNext={ () => {
				setCurrentPageKey( pageKeys[ pageKeys.length - 1 ] )
				setPageNumber( v => v + 1 )
			} }
			onPrev={ () => {
				if ( pageKeys.length <= 1 ) {
					// ^ extra precaution
					return
				}
				const pageKey = pageKeys[ pageKeys.length - 1 - 2 ] || null
				setPageKeys( v => v.slice( 0, -2 ) )
				setCurrentPageKey( pageKey )
				setPageNumber( v => v - 1 )
			} }
			lastPage={ isLastPage }
			isFetching={ isSearching }
			className="mt-50"
		/>

		{/* <Log data={ filterParams } /> */}

	</div>
}



function useSearch () {
	const [ activeSearchWidget, setActiveSearchWidget ] = React.useState<"search-by-student-id" | "filtration" | null>( null )
		// ^ which widget are the results currently based on?
		// 	The search widget? Or the filtration widget?
	const [ currentPageKey, setCurrentPageKey ] = React.useState( null )
	const [ pageKeys, setPageKeys ] = React.useState( [ ] )

	const [ pageNumber, setPageNumber ] = React.useState( 1 )
		// ^ it is best to have dedicated state for this;
		// 	attempting to derive the page nunber from
		// 	`pageKeys.length` has a few gotchas
	const [ isLastPage, setIsLastPage ] = React.useState( false )

	/**
	 | Filtration Search widget
	 |
	 */
	const [ filterParams, setFilterParams ] = React.useState( { } )
	const resetFiltrationForm = React.useCallback( function () {
		setFilterParams( v => {
			return isANonEmptyObject( v ) ? { } : v
		} )

		// if ( activeSearchWidget !== "filtration" ) {
		// 	return
		// 	// ^ if the active search widget is not "filtration"
		// 	// 	then do not re-set the pagination, triggering a fetching of records
		// }
		setPageKeys( [ ] )
		setCurrentPageKey( null )
		setPageNumber( 1 )
	}, [ activeSearchWidget ] )

	/**
	 | "Student Id" Search widget
	 |
	 */
	const [ searchParams, setSearchParams ] = React.useState( { } )
	const resetSearchForm = React.useCallback( function () {
		setSearchParams( v => {
			return isANonEmptyObject( v ) ? { } : v
		} )

		// if ( activeSearchWidget !== "search-by-student-id" ) {
		// 	return
		// 	// ^ if the active search widget is not "search-by-student-id"
		// 	// 	then do not re-set the pagination, triggering a fetching of records
		// }
		setPageKeys( [ ] )
		setCurrentPageKey( null )
		setPageNumber( 1 )
	}, [ activeSearchWidget ] )

	const onRetrieval = React.useCallback( function ( { records, nextPageKey } ) {
		if ( isEmpty( nextPageKey ) ) {
			setIsLastPage( true )
		}
		else {
			setIsLastPage( false )
			setPageKeys( v => v.concat( nextPageKey ) )
		}
	}, [ ] )
	const searchURL = composeSearchURL( {
		pageKey: currentPageKey,
		filterParams,
		searchParams,
	} )
	const [ records, isSearching ] = useRecords( {
		url: searchURL,
		onRetrieval,
	} )


	// Logs for debugging
	// React.useEffect( function () {
	// 	console.log( {
	// 		searchURL,
	// 		pageKeys,
	// 		currentPageKey
	// 	} )
	// }, [ searchURL, pageKeys.length ] )

	return {
		// activeSearchWidget,
		setActiveSearchWidget,

		// currentPageKey,
		setCurrentPageKey,
		pageKeys,
		setPageKeys,

		pageNumber,
		setPageNumber,
		isLastPage,

		filterParams,
			setFilterParams,
			resetFiltrationForm,

		// searchParams,
			setSearchParams,
			resetSearchForm,

		records,
		isSearching,
	}
}


function useRecords ( { url, onRetrieval } ) {
	const { addMessage } = useMessagesContext()
	const [ records, setRecords ] = React.useState( [ ] )
	const [ isFetching, setIsFetching ] = React.useState( false )
	const query = useHTTPQuery( {
		action: url,
		// delayResponseBy: 1.5,
		// params: q,
		onSuccess ( data ) {
			setRecords( data.Items )
			onRetrieval( {
				records: data,
				nextPageKey: data.LastEvaluatedKey
			} )
		},
		onError () {
			addMessage( { heading: "There was an issue", copy: "The transactions were unable to be retrieved. Please try again or after some time." }, { topic: "transactions/retrieval", type: "error" } )
		},
		onSettled () {
			setIsFetching( false )
		}
	} )

	React.useEffect( function () {
		query.refetch()
		setIsFetching( true )
	}, [ url ] )

	return [ records, isFetching ]
}

function composeSearchURL ( { pageKey, filterParams, searchParams } ) {
	if ( isANonEmptyObject( searchParams ) ) {
		let queryParams = [
			[ "s", searchParams.searchQuery ],
		]
		if ( isNotEmpty( pageKey?.id ) ) {
			queryParams = queryParams.concat( [ [ "page", encodeURIComponent( JSON.stringify( pageKey ) ) ] ] )
		}
		const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
		return `/api/v1/transactions/query?${ queryParamString }`
	}
	else if ( isANonEmptyObject( filterParams ) ) {
		let queryParams = [
			// [ "instituteId", "07ad046ec3f14eb1a99d9096db19404f" ],
				// ^ REMOVE THIS
			[ "status", filterParams.status ],
			[ "dateRange.start", filterParams.dateRange?.start && dayjs( filterParams.dateRange.start ).format( "YYYY-MM-DD" ) ],
			[ "dateRange.end", filterParams.dateRange?.end && dayjs( filterParams.dateRange.end ).format( "YYYY-MM-DD" ) ],
		]
		if ( isNotEmpty( pageKey?.id ) ) {
			queryParams = queryParams.concat( [ [ "page", encodeURIComponent( JSON.stringify( pageKey ) ) ] ] )
		}
		const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
		return `/api/v1/transactions/list?&${ queryParamString }`
	}
	else {
		let queryParams: any[] = [ ]
		if ( isNotEmpty( pageKey?.id ) ) {
			queryParams = queryParams.concat( [ [ "page", encodeURIComponent( JSON.stringify( pageKey ) ) ] ] )
		}
		const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
		return `/api/v1/transactions/list?&${ queryParamString }`
	}
}
