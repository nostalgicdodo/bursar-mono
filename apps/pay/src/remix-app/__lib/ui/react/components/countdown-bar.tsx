
import { useState, useRef, useEffect } from "react"

export default function CountDownBar ( { expiresOn, onExpiry, countdown = true, message, endMessage, className = "", style = { } } ) {
	const [ timeRemaining, setTimeRemaining ] = useState( () => expiresOn - Date.now() )
	const countdownDuration = useRef( timeRemaining )

	useEffect( function () {
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

	return <div className={ className } style={ style }>
		<p className="label text-indigo-3">
			{ ( minutesLeft + secondsLeftInMinute > 0 ) && <>
				{ message && <span className="mr-25">{ message }</span> }
				{ countdown && <span className="font-semibold">
					{ String( minutesLeft ).padStart( 2, "0" ) }:{ String( secondsLeftInMinute ).padStart( 2, "0" ) }
				</span> }
			</> }
			{ endMessage && ( minutesLeft + secondsLeftInMinute <= 0 ) && <>
				<span>{ endMessage }</span>
			</> }
		</p>
		<div className="relative mt-25 h-[5px] rounded-100 overflow-hidden">
			<div className="h-full bg-neutral-1"></div>
			<div className="absolute top-0 left-0 w-full h-full rounded-100 bg-purple-2 transition-transform duration-500 ease-in-out" style={{ transform: `translateX( -${ Math.ceil( 100 - countdownProgressPercentage ) }% )` }}></div>
		</div>
	</div>
}
