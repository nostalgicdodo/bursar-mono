
import { parseISO, format } from "date-fns"

import { Rupee } from "@ui/utils/currency"
import { isAnObject } from "@/utils/type-checking/object"
import { isEmpty } from "@/utils/type-checking/meta"
import { Link } from "@remix-run/react"





export default function TransactionsTable ( { records = [ ], className = "" } ) {
	return <div className={ className }>
		<table className="min-w-full border border-neutral-1 divide-y divide-neutral-3 max-md:label p">
			<thead className="bg-neutral-1/30 text-black text-left whitespace-nowrap">
				<tr>
					{ COLUMNS.map( ( c, i ) => <th key={ i } className="px-75 py-50">{ c.label }</th> ) }
				</tr>
			</thead>
			<tbody className="divide-y divide-neutral-2 bg-white text-neutral-6 whitespace-nowrap | [&>tr:nth-child(even)]:bg-light">
				{ records.map( ( r, i ) => <tr key={ i } className="hover:!bg-purple-2/25">
					{ COLUMNS.map( ( h, i ) => <td key={ i }>
						{ h.key === "userId" && <span className="">{ mapColumnToValue( h.key, r[ h.key ] ) }</span> }
						{ h.key !== "userId" && <Link to={ `/transactions/${ r.id }/events?instituteId=${ r.instituteId }&refId=${ r.refId }` } target="_blank" className="block px-75 py-50">
							<span className="">{ mapColumnToValue( h.key, r[ h.key ] ) }</span>
						</Link> }
					</td> ) }
				</tr> ) }
			</tbody>
		</table>
	</div>
}

const COLUMNS = [
	{ key: "createdAt", label: "Initiated At" },
	{ key: "userName", label: "Name" },
	{ key: "userId", label: "Student Id" },
	{ key: "status", label: "Status" },
	{ key: "pgOrderId", label: "PG Order Id" },
	{ key: "amount", label: "Amount" },
	{ key: "updatedAt", label: "Updated At" },
	{ key: "refId", label: "Reference Id" },
	// { key: "refund", label: "Refund" },
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
	updatedAt: ( v: string ) => format( parseISO( v ), "hh:mm bbb, dd/LL" ).replace( "noon", "pm" ).replace( "midnight", "am" ),
	expiresOn: ( v: string ) => format( parseISO( v ), "hh:mm bbb, dd/LL" ).replace( "noon", "pm" ).replace( "midnight", "am" ),
	amount: ( v: string ) => formatAsRupee( v ),
	status: ( v: string ) => v.toLowerCase() === "failed" ? "uncomplete" : v,
}

const formatAsRupee = Rupee.createFormatter( {
	spaceBetweenSymbolAndAmount: true
} )
