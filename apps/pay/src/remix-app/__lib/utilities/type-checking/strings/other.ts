
import { lineFeedRegex } from "@/utilities/regular-expressions"

export function hasLineFeeds ( value: string ) {
	return lineFeedRegex.test( value )
}
	export function doesNotHaveLineFeeds ( value: string ) {
		return ! lineFeedRegex.test( value )
	}
