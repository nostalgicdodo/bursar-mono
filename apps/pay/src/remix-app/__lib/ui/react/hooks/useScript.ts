
/**
 |
 | useScript
 |
 | Source:
 | https://usehooks.com/usescript
 | https://github.com/uidotdev/usehooks/blob/90fbbb4cc085e74e50c36a62a5759a40c62bb98e/index.js
 |
 */

import { isNotNull } from "@/utilities/type-checking/null-or-undefined"
import { useState, useRef, useEffect } from "react"




type ScriptStatus = "unknown" | "loading" | "ready" | "error"
export default function useScript ( src: string, options: { removeOnUnmount?: boolean } = { } ) {
	const [ status, setStatus ] = useState<ScriptStatus>( "loading" )
	const optionsRef = useRef( options )

	useEffect( () => {
		const existingScript: HTMLScriptElement | null = document.querySelector( `script[src="${ src }"]` )

		const domStatus = existingScript?.getAttribute( "data-status" )
		if ( domStatus ) {
			setStatus( domStatus )
			return
		}

		if ( isNotNull( existingScript ) ) {
			setStatus( "unknown" )
			return
		}

		// If the script did not already exist in the DOM, then create it
		const newScript = document.createElement( "script" )
		newScript.src = src
		newScript.async = true
		newScript.setAttribute( "data-status", "loading" )
		document.body.appendChild( newScript )

		// Event handlers
		const handleLoadEvent = () => {
			newScript.setAttribute( "data-status", "ready" )
			setStatus( "ready" )
			removeEventListeners()
		}
		const handleErrorEvent = () => {
			newScript.setAttribute( "data-status", "error" )
			setStatus( "error" )
			removeEventListeners()
		}

		const removeEventListeners = () => {
			newScript.removeEventListener( "load", handleLoadEvent )
			newScript.removeEventListener( "error", handleErrorEvent )
		}

		newScript.addEventListener( "load", handleLoadEvent )
		newScript.addEventListener( "error", handleErrorEvent )

		const removeOnUnmount = optionsRef.current.removeOnUnmount

		return () => {
			if ( removeOnUnmount === true ) {
				removeEventListeners()
				newScript.remove()
			}
		}
	}, [ src ] )

	return status
}
