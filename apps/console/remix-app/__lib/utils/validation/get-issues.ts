
import { getProperty } from "dot-prop"


export async function getIssues ( data, validations ) {
	let issues: Record<string, string[]> = Object.fromEntries( Object.keys( validations ).map( k => [ k, [ ] ] ) )
	let thereAreIssues = false

	for ( let key in validations ) {
		let validationsForCurrentKey = validations[ key ]
		if ( typeof validationsForCurrentKey === "function" ) {
			validationsForCurrentKey = validationsForCurrentKey( getProperty( data, key ) ?? "" )
		}
		for ( let validation of validationsForCurrentKey ) {
			if ( await validation.fails.call( data, getProperty( data, key ) ?? "" ) ) {
				issues[ key ] = issues[ key ].concat( validation.errorType )
				thereAreIssues = true
				if ( validation.shortCircuit ) {
					break
				}
			}
		}
	}

	return {
		thereAreIssues,
		details: issues,
	}
}
