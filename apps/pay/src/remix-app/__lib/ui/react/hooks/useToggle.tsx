
import { isUndefined } from "@/utilities/type-checking/null-or-undefined";
import { useReducer, useMemo } from "react"

type UseToggleReturn = [
	boolean,
	{
		setOn: () => void;
		setOff: () => void;
		toggle: () => void;
	}
]

export default function useToggle ( defaultValue: boolean = false ): UseToggleReturn {
	const [ isOn, dispatch ] = useReducer( function ( state: boolean, action?: boolean ) {
		return isUndefined( action ) ? !state : action
	}, defaultValue )

	const api = useMemo( () => ({
		setOn () {
			return dispatch( true )
		},
		setOff () {
			return dispatch( false )
		},
		toggle () {
			return dispatch()
		}
	}), [ ] )

	return [ isOn, api ]
}
