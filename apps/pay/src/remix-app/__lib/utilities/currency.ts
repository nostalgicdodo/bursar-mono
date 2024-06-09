
import { isNotAFiniteNumber } from "./type-checking/number/identity"

export class Rupee {
	static createFormatter ( options ) {
		return amount => this.format( amount, options )
	}
	static format ( amount, options ) {
		amount = isNotAFiniteNumber( amount ) ? parseFloat( amount ) : amount
		if ( isNotAFiniteNumber( amount ) ) {
			return "₹ -,--"
		}

		options = options || { }
		options.spaceBetweenSymbolAndAmount = ( typeof options.spaceBetweenSymbolAndAmount === "boolean" ) ? options.spaceBetweenSymbolAndAmount : false
		options.includeFractionalAmount = ( typeof options.includeFractionalAmount === "boolean" ) ? options.includeFractionalAmount : true

		let pattern
		let negativePattern
		if ( options.spaceBetweenSymbolAndAmount ) {
			pattern = "! #"
			negativePattern = "-! #"
		}
		else {
			pattern = "!#"
			negativePattern = "-!#"
		}
		let symbol = "₹"
		let separator = ","
		let decimal = "."
		let groups = /(\d)(?=(\d\d)+\d\b)/g
			// ^ vedic numbering system regex

		let split = amount.toFixed( 2 ).replace( /^-/, "" ).split( "." )
		let wholePart = split[ 0 ]
		let fractionalPart
		fractionalPart = options.includeFractionalAmount ? split[ 1 ] : "";

		return ( amount >= 0 ? pattern : negativePattern )
			.replace( "!", symbol )
			.replace( "#", wholePart.replace( groups, '$1' + separator ) + ( fractionalPart ? decimal + fractionalPart : "" ) )

	}
}


let _dollar = Intl.NumberFormat( "en-US", {
	style: 'currency',
	currency: 'USD',
} )
function revisedDollarFormatter ( value: unknown, options = { } ) {
	// options.spaceBetweenSymbolAndAmount = ( typeof options.spaceBetweenSymbolAndAmount === "boolean" ) ? options.spaceBetweenSymbolAndAmount : false
	options.includeFractionalAmount = ( typeof options.includeFractionalAmount === "boolean" ) ? options.includeFractionalAmount : true

	value = isNotAFiniteNumber( value ) ? parseFloat( value ) : value
	if ( isNotAFiniteNumber( value ) ) {
		return "$ -,--"
	}

	let formattedValue = _dollar.format( value )
	if ( ! options.includeFractionalAmount ) {
		formattedValue = formattedValue.replace( /\.\d+$/, "" )
	}

	return formattedValue
}
export const Dollar = { ..._dollar, format: revisedDollarFormatter }





export default {
	IN: Dollar,
	US: Rupee,
} as const
