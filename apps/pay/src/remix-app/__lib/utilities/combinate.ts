
/**
|
| Combinate
|
| Taken from:
| https://github.com/nas5w/combinate
|
*/

export default function combinate<T extends Record<string | number, any[]>> ( record: T ) {
	let combos: { [ k in keyof T ]: T[ k ][ number ] }[] = []
	for ( let key in record ) {
		const values = record[ key ]
		const all = [ ]
		for ( let i = 0; i < values.length; i += 1 ) {
			for ( let j = 0; j < ( combos.length || 1 ); j += 1 ) {
				const newCombo = {
					...combos[ j ],
					[ key ]: values[ i ]
				}
				all.push( newCombo )
			}
		}
		combos = all
	}
	return combos
}
