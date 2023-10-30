
const numberRegex = /^[\d]+(\.[\d]+)?$/
export function isStringANumber ( value: string ) {
	return numberRegex.test( value )
}
	export function isStringNotANumber ( value: string ) {
		return ! isStringANumber( value )
	}
