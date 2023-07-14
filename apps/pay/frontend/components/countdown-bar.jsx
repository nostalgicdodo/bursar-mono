
import * as React from "react"
import styles from "./countdown-bar.css"

export { styles }

export default function CountDownBar ( { expiresOn, onExpiry, countdown = true, message, endMessage, className = "", style = { } } ) {
	const [ timeRemaining, setTimeRemaining ] = React.useState( () => expiresOn - Date.now() )
	const countdownDuration = React.useRef( timeRemaining )

	React.useEffect( function () {
		if ( timeRemaining <= 0 ) {
			if ( typeof onExpiry === "function" ) {
				onExpiry()
			}
			return
		}

		let timeoutId
		timeoutId = setTimeout( function () {
			setTimeRemaining( expiresOn - Date.now() )
		}, 1000 )

		return function () {
			clearTimeout( timeoutId )
		}
	}, [ timeRemaining ] )


	const countdownProgressPercentage = ( ( countdownDuration.current - timeRemaining ) / countdownDuration.current ) * 100
	const seconds = timeRemaining / 1000
	const minutesLeft = Math.floor( seconds / 60 )
	const secondsLeftInMinute = Math.floor( seconds % 60 )

	return <div className={ `countdown ${ className }` } style={ style }>
		<p className="space-25-bottom label text-indigo-3">
			{ ( minutesLeft + secondsLeftInMinute > 0 ) && <>
				{ message && <span className="space-25-right">{ message }</span> }
				{ countdown && <span className="time">
					{ String( minutesLeft ).padStart( 2, "0" ) }:{ String( secondsLeftInMinute ).padStart( 2, "0" ) }
				</span> }
			</> }
			{ endMessage && ( minutesLeft + secondsLeftInMinute <= 0 ) && <>
				<span>{ endMessage }</span>
			</> }
		</p>
		<div className="progress-bar radius-100">
			<div className="hourglass"></div>
			<div className="sand radius-100" style={{ transform: `translateX( -${ Math.ceil( 100 - countdownProgressPercentage ) }% )` }}></div>
		</div>
	</div>
}
