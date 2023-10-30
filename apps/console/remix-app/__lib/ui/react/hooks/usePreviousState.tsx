
import * as React from "react"

export default function usePreviousValue ( newValue: any ) {
	const previousValue = React.useRef( null )
	const currentValue = React.useRef( newValue )
	React.useMemo( function () {
		if ( currentValue.current === newValue ) {
			return
		}
		previousValue.current = currentValue.current
		currentValue.current = newValue
	}, [ newValue ] )
	return previousValue.current
}

// export default function usePreviousState ( currentState: any ) {
// 	const [ previousState, setPreviousState ] = React.useState( [ null, currentState ] )
// 	React.useEffect( function () {
// 		setPreviousState( [ previousState[ 1 ], currentState ] )
// 	}, [ currentState ] )
// 	return previousState[ 0 ]
// }
