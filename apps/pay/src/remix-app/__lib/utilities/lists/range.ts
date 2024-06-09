
/**
 |
 | Creates a generator that will produce an iteration through
 | the number range.
 |
 | @examples
 | range( 3 )                  // yields 0, 1, 2, 3
 | range( 0, 3 )               // yields 0, 1, 2, 3
 | range( 0, 3, 'y' )          // yields y, y, y, y
 | range( 0, 3, ( ) => 'y' )    // yields y, y, y, y
 | range( 0, 3, i => i )       // yields 0, 1, 2, 3
 | range( 0, 3, i => `y${i}` ) // yields y0, y1, y2, y3
 | range( 0, 3, obj )          // yields obj, obj, obj, obj
 | range( 0, 6, i => i, 2 )    // yields 0, 2, 4, 6
 |
 |
 | Taken from:
 | https://github.com/rayepps/radash
 |
 |
 */

// DO NOT ALTER THE PATHS OF THE DEPENDENCIES;
	// TAILWIND'S CONFIGURATION DOES NOT PLAY WELL WITH ALIASES
import { isNotAFunction } from "../type-checking/function"
import { isUndefined } from "../type-checking/null-or-undefined"
import { isNotAFiniteNumber } from "../type-checking/number/identity"
import identity from "../functions/identity"





export default function* range<T = number> (
	startOrLength: number,
	end?: number,
	valueOrMapper?: T | ( ( i: number ) => T ),
	step?: number
): Generator<T> {
	let mapper
	if ( isUndefined( valueOrMapper ) ) {
		mapper = identity as ( ( i: number ) => T )
	}
	else if ( isNotAFunction( valueOrMapper ) ) {
		mapper = () => valueOrMapper
	}
	else {
		mapper = valueOrMapper
	}

	const start = end ? startOrLength : 0
	const final = end ?? startOrLength
	if ( isNotAFiniteNumber( step ) ) {
		step = ( final < 0 ) ? -1 : 1
	}
	const absoluteStep = Math.abs( step )


	let i = start
	while ( Math.abs( final - i ) >= absoluteStep ) {
		yield mapper( i )
		i = i + step
	}

	yield mapper( i )
}
