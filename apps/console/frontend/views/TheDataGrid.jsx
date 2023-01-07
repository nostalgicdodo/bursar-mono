
import * as React from "react"
import { format } from "date-fns"
import {
	DataGrid,
	DataGridHead,
	DataGridRow,
	DataGridHeader,
	DataGridBody,
	DataGridCell,
	SortDirection,
} from "@twilio-paste/core/data-grid"

const { Rupee } = require( "@ui/utils/currency.js" )

/*
 | Import UI Components
 |
 */
import { CheckboxCell } from "~/components/data-grid/checkbox-cell"


const TABLE_HEADERS = [
	{ key: "createdAt", label: "Initiated At" },
	{ key: "userName", label: "Name" },
	{ key: "userId", label: "Student Id" },
	{ key: "status", label: "Status" },
	{ key: "pgOrderId", label: "PG Order Id" },
	{ key: "amount", label: "Amount" },
	{ key: "updatedAt", label: "Updated At" },
	{ key: "refId", label: "Reference Id" },
	// { key: "userDetails", label: "" },
	// { key: "pgCallback", label: "Order Status" },
];

export function TheDataGrid ({
	data,
}) {
	return <DataGrid aria-label="Transactions" scrollHorizontally noWrap striped>
		<DataGridHead>
			<DataGridRow>
				{TABLE_HEADERS.map((header) => (
					<DataGridHeader key={header.key}>{header.label}</DataGridHeader>
				))}
			</DataGridRow>
		</DataGridHead>
		<DataGridBody>
			{ data.map( ( r, rIndex ) => <DataGridRow _key={r.id} key={`row-${rIndex}`}>
				{ TABLE_HEADERS.map(
					( h, hIndex ) => <DataGridCell key={`col-${hIndex}`}>
						{ map( h.key, r[ h.key ] ) }
					</DataGridCell>
				) }
			</DataGridRow> ) }
		</DataGridBody>
	</DataGrid>
}

function map ( key, value ) {
	if ( typeof mapFns[ key ] === "function" )
		return mapFns[ key ]( value )
	if ( typeof value === "object" )
		return JSON.stringify( value )
	if ( [ null, void 0, NaN, "" ].includes( value ) )
		return "—"
	return value
}

const mapFns = {
	createdAt: v => format( v, "hh:mm bbb, dd/LL" ).replace( "noon", "pm" ).replace( "midnight", "am" ),
	updatedAt: v => format( v, "hh:mm bbb, dd/LL" ).replace( "noon", "pm" ).replace( "midnight", "am" ),
	expiresOn: v => format( v, "hh:mm bbb, dd/LL" ).replace( "noon", "pm" ).replace( "midnight", "am" ),
	amount: v => formatAsRupee( v ),
	status: v => v.toLowerCase() === "failed" ? "uncomplete" : v,
}

const formatAsRupee = Rupee.createFormatter( {
	spaceBetweenSymbolAndAmount: true
} )
