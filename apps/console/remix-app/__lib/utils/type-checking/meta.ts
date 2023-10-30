
import { isNullOrUndefined } from "./null-or-undefined"
import { isBlankString } from "./strings/identity"

export function isEmpty ( value: unknown ): value is null | undefined | "" {
	return isNullOrUndefined( value ) || isBlankString( value )
}
export function isNotEmpty<T extends any> ( value: unknown ): value is Exclude<T, null | undefined | ""> {
	return ! isEmpty( value )
}
