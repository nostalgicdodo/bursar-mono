
import { getProperty } from "dot-prop"
import { parseISO, format } from "date-fns"

import { isAnObject } from "@/utilities/type-checking/object"
import { isEmpty } from "@/utilities/type-checking/meta"





export default function TransactionEventsTable ( { records = [ ], className = "" } ) {
	return <div className={ className }>
		<table className="min-w-full border border-neutral-1 divide-y divide-neutral-3 max-md:label">
			<thead className="bg-neutral-1/30 p text-black text-left whitespace-nowrap">
				<tr>
					{ COLUMNS.map( ( c, i ) => <th key={ i } className="px-75 py-50">{ c.label }</th> ) }
				</tr>
			</thead>
			<tbody className="divide-y divide-neutral-2 bg-white p text-neutral-6 whitespace-nowrap | [&>tr:nth-child(even)]:bg-light">
				{ records.map( ( r, i ) => <tr key={ i }>
					{ COLUMNS.map( ( h, i ) => <td key={ i } className="px-75 py-50">
						{ mapColumnToValue( h.key, getProperty( r, h.key ) ) }
					</td> ) }
				</tr> ) }
			</tbody>
		</table>
	</div>
}

const COLUMNS = [
	{ key: "createdAt", label: "Occurred At" },
	{ key: "type", label: "Type" },
	{ key: "context.event_name", label: "Name" },
	{ key: "context", label: "Context" },
]

function mapColumnToValue ( key, value ) {
	if ( typeof mapFns[ key ] === "function" ) {
		return mapFns[ key ]( value )
	}
	if ( isAnObject( value ) ) {
		return JSON.stringify( value )
	}
	if ( isEmpty( value ) ) {
		return "—"
	}
	return value
}


const mapFns = {
	createdAt: ( v: string ) => format( parseISO( v ), "hh:mm bbb, dd/LL" ).replace( "noon", "pm" ).replace( "midnight", "am" ),
}
