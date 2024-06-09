
import type { Falsy } from "../typescript-types/common-types"

import { isNotAnArray } from "../type-checking/array"

export default function removeWordsFromString ( v: string, strings: string | Falsy | (string | Falsy)[] ) {
	if ( isNotAnArray( strings ) ) {
		strings = [ strings ]
	}

	return v.replace(
		new RegExp(
			"\\b"
			+ `(${ strings.filter( s => s ).join( "|" ) })`
			+ "\\b",
			"g"
		),
		""
	)
}
