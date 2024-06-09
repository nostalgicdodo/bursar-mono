
import * as React from "react"

type UseToggleReturn = [
	boolean,
	{
		setOn: () => void;
		setOff: () => void;
		toggle: () => void;
	}
]

export default function useToggle ( defaultValue: boolean = false ): UseToggleReturn {
	const [ isOn, dispatch ] = React.useReducer( function ( state: boolean, action: boolean ) {
		return action
	}, defaultValue )

	const api = React.useMemo( () => ({
		setOn () {
			return dispatch( true )
		},
		setOff () {
			return dispatch( false )
		},
		toggle () {
			return dispatch( ! isOn )
		}
	}), [ ] )

	return [ isOn, api ]
}
