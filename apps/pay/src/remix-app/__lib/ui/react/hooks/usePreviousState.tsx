
import { useRef } from "react"

export default function usePreviousValue ( newValue: any ) {
	const previousValue = useRef( null )
	const currentValue = useRef( newValue )

	if ( currentValue.current !== newValue ) {
		previousValue.current = currentValue.current
		currentValue.current = newValue
	}
	return previousValue.current

	// useMemo( function () {
	// 	if ( currentValue.current === newValue ) {
	// 		return
	// 	}
	// 	previousValue.current = currentValue.current
	// 	currentValue.current = newValue
	// }, [ newValue ] )
	// return previousValue.current
}

// export default function usePreviousState ( currentState: any ) {
// 	const [ previousState, setPreviousState ] = useState( [ null, currentState ] )
// 	useEffect( function () {
// 		setPreviousState( [ previousState[ 1 ], currentState ] )
// 	}, [ currentState ] )
// 	return previousState[ 0 ]
// }
