
import { ObjectType } from "../typescript-types/common-types";

export default function sum<T = ObjectType> ( list: T[], get: ( e: T ) => number, initial: number = 0 ) {
	return list.reduce( function ( acc, e ) {
		return acc + get( e )
	}, initial )
}
