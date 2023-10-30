
/**
 |
 | Sort an array
 |
 | Taken from:
 | https://github.com/rayepps/radash
 |
 */

// by string
export default function sortListByString<T> ( list: readonly T[], getter: ( item: T ) => string, dir: "asc" | "desc" = "asc" ) {
	const sortFn = dir === "asc"
		? ( a: T, b: T ) => `${ getter( a ) }`.localeCompare( getter( b ) )
		: ( a: T, b: T ) => `${ getter( b ) }`.localeCompare( getter( a ) )

	return list
		.slice()
			// ^ make a copy of the array first
		.sort( sortFn )
}
