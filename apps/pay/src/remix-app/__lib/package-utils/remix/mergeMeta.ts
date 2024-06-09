
/**
 |
 | Merge Meta Descriptors
 |
 | Reference: https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069
 | 	Modified the behaviour of the first argument:
 | 		If the parent does not have an existing meta tag
 | 		to be overridden, then it is simply appended to it.
 |
 |
 */

import type { V2_HtmlMetaDescriptor, V2_MetaFunction } from "@remix-run/node"

export function mergeMeta ( overrideFn: V2_MetaFunction, appendFn?: V2_MetaFunction ): V2_MetaFunction {
	return function ( arg ) {
		// Get meta from parent routes
		let mergedMeta = arg.matches.reduce( ( acc, match ) => {
			return acc.concat( match.meta || [ ] )
		}, [ ] as V2_HtmlMetaDescriptor[ ] )

		// Replace any parent meta with the same name or property with the override
		// 	else, append to it
		let overrides = overrideFn( arg )
		for ( let override of overrides ) {
			let index = mergedMeta.findIndex( function ( meta ) {
				return (
					(
						"name" in meta
						&& "name" in override
						&& meta.name === override.name
					) || (
						"property" in meta
						&& "property" in override
						&& meta.property === override.property
					) || (
						"title" in meta
						&& "title" in override
					)
				)
			} )

			if ( index !== -1 ) {
				mergedMeta.splice( index, 1, override )
			}
			else {
				mergedMeta = mergedMeta.concat( override )
			}
		}

		// append any additional meta
		if ( appendFn ) {
			mergedMeta = mergedMeta.concat( appendFn( arg ) )
		}

		return mergedMeta
	}
}
