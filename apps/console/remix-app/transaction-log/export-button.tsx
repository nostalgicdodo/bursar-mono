
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"

import dayjs from "@/packages/dayjs"

import { isStringBlank } from "@/utils/type-checking/strings/identity"
import ButtonSecondary from "@/ui/react/components/buttons/button-secondary"





export default function ExportButton ( { filterParams, className = "" } ) {
	const exportURL = composeExportURL( filterParams )

	return <div className={ `text-right ${ className }` }>
		{/* <Link to={ exportURL } className="inline-block space-x-min">
			<ArrowDownTrayIcon className="w-75" />
			<span>Export CSV</span>
		</Link> */}
		<ButtonSecondary as="a" href={ exportURL } case="normal" className="space-x-min">
			<ArrowDownTrayIcon className="w-75" />
			<span>Export CSV</span>
		</ButtonSecondary>
	</div>
}



/**
 |
 | Helpers
 |
 |
 */
function composeExportURL ( filterParams ) {
	let queryParams = [
		[ "export", true ],
		// [ "instituteId", "07ad046ec3f14eb1a99d9096db19404f" ],
			// ^ REMOVE THIS
		[ "status", filterParams.status ],
		[ "dateRange.start", filterParams.dateRange?.start && dayjs( filterParams.dateRange.start ).format( "YYYY-MM-DD" ) ],
		[ "dateRange.end", filterParams.dateRange?.end && dayjs( filterParams.dateRange.end ).format( "YYYY-MM-DD" ) ],
	]
	const queryParamString = queryParams.map( p => p.join( "=" ) ).join( "&" )
	const url = "/api/v1/transactions/list"
	return isStringBlank( queryParamString ) ? url : ( url + "?" + queryParamString )
}
