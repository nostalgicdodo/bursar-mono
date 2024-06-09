
import type { InvertRecord } from "@/utilities/typescript-types/common-types"

import { getProperty, setProperty } from "dot-prop"

import { isAString } from "@/utilities/type-checking/strings/identity"
import { isAnArray } from "@/utilities/type-checking/array"

/*
 | A more intuitive alternative to Object.create
 |
 */
/**-> to doi! */
// Type this well
export function createObjectWithPrototype ( object, prototype ) {
	return Object.assign( Object.create( prototype ), object )
}

export function selectFromObject ( input, keys: string | string[ ] ) {
	if ( isAString( keys ) ) {
		return getProperty( input, keys )
	}
	if ( isAnArray( keys ) ) {
		if ( keys.length === 1 ) {
			return getProperty( input, keys[ 0 ] )
		}

		// This part of the function is not being used
		// 	as it triggers infinite loops
		let output = { }
		for ( let key of keys ) {
			setProperty( output, key, getProperty( input, key ) )
		}
		return output
	}
	return null
}

export function invertRecord<T extends Record<PropertyKey, PropertyKey>> ( input: T ) {
	return Object.fromEntries(
		Object.entries( input ).map( ([ key, value ]) => [
			value,
			key,
		] ),
	) as InvertRecord<T>
}

export function prefixRecordKeys ( input: Record<PropertyKey, unknown>, prefix: string ) {
	return Object.fromEntries(
		Object.entries( input ).map( ([ k, v ]) => [ prefix + k, v ] )
	)
}
