
/* DISCLAIMER: this is an example, not meant to be used in production */

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
import { ScreenReaderOnly } from "@twilio-paste/core/screen-reader-only"
import { CheckboxGroup } from "@twilio-paste/core/checkbox"
import { useUIDSeed } from "@twilio-paste/core/uid-library"

import { formatDate, formatDateTime } from "~/lib/helpers"

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
	showDateTime = false
}) {
	const seed = useUIDSeed()
	const [ checkedItems, setCheckedItems ] = React.useState( ( new Array( data.length ) ).fill( false ) )
	const allChecked = checkedItems.every( Boolean )
	const indeterminate = checkedItems.some( Boolean ) && !allChecked

	return <CheckboxGroup name="items" legend="Select transactions">
		<DataGrid aria-label="Transactions" scrollHorizontally noWrap striped>
			<DataGridHead>
				<DataGridRow>
					<DataGridHeader width="55px">
						<CheckboxCell
							onClick={ checked => {
								const newCheckedItems = checkedItems.map( () => checked )
								setCheckedItems( newCheckedItems )
							} }
							id={ seed( "select-all" ) }
							checked={ allChecked }
							indeterminate={ indeterminate }
							label="Select all"
						/>
					</DataGridHeader>
					{TABLE_HEADERS.map((header) => (
						<DataGridHeader key={header.key}>{header.label}</DataGridHeader>
					))}
				</DataGridRow>
			</DataGridHead>
			<DataGridBody>
				{ data.map( ( r, rIndex ) => <DataGridRow _key={r.id} key={`row-${rIndex}`} selected={ checkedItems[ rIndex ] }>
					<DataGridCell>
						<CheckboxCell
							onClick={ checked => {
								const newCheckedItems = [ ...checkedItems ]
								newCheckedItems[ rIndex ] = checked
								setCheckedItems( newCheckedItems )
							} }
							id={ seed(`row-${rIndex}-checkbox`) }
							checked={ checkedItems[ rIndex ] }
							label={ `Select row ${rIndex}` }
						/>
					</DataGridCell>
					{ TABLE_HEADERS.map(
						( h, hIndex ) => <DataGridCell key={`col-${hIndex}`}>
							{ map( h.key, r[ h.key ] ) }
						</DataGridCell>
					) }
				</DataGridRow> ) }
			</DataGridBody>
		</DataGrid>
	</CheckboxGroup>
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
	createdAt: v => format( v, "hh:mm bbb, dd/LL" ),
	updatedAt: v => format( v, "hh:mm bbb, dd/LL" ),
	expiresOn: v => format( v, "hh:mm bbb, dd/LL" ),
	amount: v => formatAsRupee( v )
}

const formatAsRupee = Rupee.createFormatter( {
	spaceBetweenSymbolAndAmount: true
} )
