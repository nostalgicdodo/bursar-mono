
/**
 |
 | Determine a slug that is not in use for any other existing record
 |
 |
 */

import slug from "@/packages/slug"
import { isEmpty } from "../type-checking/meta";
import { isArrayEmpty, isNotAnArray } from "../type-checking/array";





const HYPHEN_FOLLOWED_BY_DIGITS = /^-\d+$/

type getUnusedSlugProps = {
	slug?: string;
	candidate: string;
	getMatchingSlugs: ( s: string ) => Promise<any>;
	exclude?: string;
}
export default async function getUnusedSlug ( { slug: slugString, candidate, getMatchingSlugs, exclude = "" }: getUnusedSlugProps ) {
	if ( isEmpty( slugString ) ) {
		slugString = slug( candidate )
		// slugString = candidate.replaceAll( "'", "" ).replace( /\s+/g, "-" ).toLowerCase()
	}
	const recordsWithMatchingSlugs = await getMatchingSlugs( slugString )
	// If no matching records were found, then the provided `slug` will work just fine
	if ( isNotAnArray( recordsWithMatchingSlugs ) || isArrayEmpty( recordsWithMatchingSlugs ) ) {
		return slugString
	}

	const matchingSlugs = recordsWithMatchingSlugs
			.map( record => record.slug )
			.filter( slug => slug !== exclude )
				// ^ the record for which the slug is being determined should be excluded from consideration,
				// 	else it will simply increment the existing slug

	// Extract the numeric suffixes from all the existing matching slugs
	const numericSuffixes = matchingSlugs
		.map( s => s.replace( slugString, "" ) )
			// ^ trim out the common base
		.filter( s => HYPHEN_FOLLOWED_BY_DIGITS.test( s ) )
			// ^ filter out one that are not related
		.map( s => s.slice( 1 ) )
		.map( n => parseInt( n, 10 ) )

	const highestNumericSuffix = numericSuffixes.length === 0 ? 1 : Math.max( ...numericSuffixes )
	const numericSuffix = highestNumericSuffix + 1

	return slugString + "-" + numericSuffix
}
