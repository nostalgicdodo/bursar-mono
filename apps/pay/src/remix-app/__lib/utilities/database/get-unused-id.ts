
/**
 |
 | Determine a slug that is not in use for any other existing record
 |
 |
 */

import range from "../lists/range"





export async function getUnusedId (
	generateId: ( ...args: any ) => string | Promise<string>,
	getRecordsWithIds: ( ids: string[] ) => Promise<{ id: string }[]>,
	idBatchSize: number = 25
		// ^ number of ids to generate and
		// 		used to search the database
		// 		for matches at a time
) {
	let ids: string[]
	let recordsWithMatchingIds

	do {
		ids = [ ]
		for ( let _ of range( idBatchSize ) ) {
			ids = ids.concat( await generateId() )
		}
		recordsWithMatchingIds = await getRecordsWithIds( ids )
		recordsWithMatchingIds = recordsWithMatchingIds ?? [ ]
	} while ( recordsWithMatchingIds.length >= idBatchSize )

	const existingIds = recordsWithMatchingIds.map( r => r.id )
	return ids.find(
		e => !existingIds.includes( e )
	)
}

export async function getUnusedIds (
	n: number = 1,
	generateId: ( ...args: any ) => string | Promise<string>,
	getRecordsWithIds: ( ids: string[] ) => Promise<{ id: string }[]>,
	idBatchSize: number = n
		// ^ number of ids to generate and
		// 		used to search the database
		// 		for matches at a time
) {
	let ids: string[]
	let recordsWithMatchingIds
	let numberOfUnusedIds = 0
	let unusedIds: string[] = [ ]

	do {
		ids = [ ]
		for ( let _ of range( idBatchSize ) ) {
			ids = ids.concat( await generateId() )
		}
		recordsWithMatchingIds = await getRecordsWithIds( ids )
		recordsWithMatchingIds = recordsWithMatchingIds ?? [ ]

		const idsThatExist = recordsWithMatchingIds.map( r => r.id )
		unusedIds = unusedIds.concat( ids.filter( id => !idsThatExist.includes( id ) ) )

		numberOfUnusedIds += ( idBatchSize - recordsWithMatchingIds.length )
	} while ( numberOfUnusedIds < n )

	return unusedIds.slice( 0, n )
}
