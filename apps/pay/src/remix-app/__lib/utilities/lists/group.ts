
/**
 |
 | Groups elements in an list by a specified criteria
 |
 | Taken from:
 | https://github.com/rayepps/radash
 |
 */

export default function group<T, Key extends PropertyKey> ( list: readonly T[], getGroupId: ( item: T ) => Key ) {
	return list.reduce( function ( acc, item ) {
		const groupId = getGroupId( item )

		if ( ! acc[ groupId ] ) {
			acc[ groupId ] = [ ]
		}
		acc[ groupId ].push( item )

		return acc
	}, { } as Record<Key, T[]> )
}
