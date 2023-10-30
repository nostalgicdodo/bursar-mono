
export default function splice ( list, index ) {
	return list.slice( 0, index ).concat( list.slice( index + 1 ) )
}
