
/**
 |
 | Messages Context
 |
 |
 */

import * as React from "react"
import { renderToString } from "react-dom/server"
import { toast } from "sonner"

import { isANumber, isNotANumber } from "@/utilities/type-checking/number"
import { isEmpty } from "@/utilities/type-checking/meta"
import { Message } from "../components/messaging-hub"
import { isAString, isNonBlankString, isNotAString } from "@/utilities/type-checking/strings/identity"
import splice from "@/utilities/lists/splice"
import { isANonEmptyObject, isAnObject } from "@/utilities/type-checking/object"

const ONE_HOUR = 60 * 60 * 1000

const MessagesContext = React.createContext<any>( null )
MessagesContext.displayName = "MessagesContext"

export type AddMessageContent = string | { heading: string, copy: string } | React.ReactNode
export type AddMessageOptions = Partial<{
	topic: string;
	type: "info" | "loading" | "success" | "error";
	delayBy: number;
}>

function MessagesProvider ( { children } ) {
	const messages = React.useRef( [ ] )
	const scheduledTasks = React.useRef( [ ] )

	React.useEffect( function () {
		// window._xyz = messages
		// setInterval( function () {
			// console.log( window._xyz.current.map( e => e.id ) )
			// console.log( window._xyz.current.map( e => e.content ) )
		// }, 1500 )

		return () => {
			// Un-schedule all the scheduled tasks
			scheduledTasks.current.forEach( task => clearTimeout( task.timeoutId ) )
		}
	}, [ ] )

	const addMessage = React.useCallback( function addMessage ( content: AddMessageContent, options: AddMessageOptions = { } ) {
		const { topic, delayBy, type } = options

		const indexOfMessageWithExistingTopic = topic
			? messages.current.findIndex( m => ( m.topic && m.topic === topic ) )
			: -1

		let message = {
			id: topic ?? null,
			topic: topic ?? null,
			type,
			content
		}

		function onRemoval () {
			messages.current = messages.current.filter( e => e.id !== message.id )
		}
		function onAdd ( id ) {
			message.id = id
			if ( indexOfMessageWithExistingTopic !== -1 && topic ) {
				messages.current[ indexOfMessageWithExistingTopic ] = message
			}
			else {
				messages.current = messages.current.concat( message )
			}
		}

		if ( isANumber( delayBy ) ) {
		}
		else {
			makeToast( { content, type, topic, onAdd, onRemoval } )
		}
	}, [ ] )

	const scheduleRemoval = React.useCallback( function scheduleRemoval ( id, duration, onRemoval ) {
		let timeoutId = setTimeout( function () {
			// 1. remove the scheduled task
			scheduledTasks.current = scheduledTasks.current.filter( e => {
				return !( e.action === "REMOVE" && e.id === id )
			} )
			// 2. dismiss the toast from the underlying toast library
			toast.dismiss( id )
			// 3. remove the message from our state
			onRemoval()
		}, duration )

		// Append the scheduled task
		scheduledTasks.current = scheduledTasks.current.concat( {
			action: "REMOVE",
			id,
			timeoutId,
		} )
	}, [ ] )

	const unScheduleRemoval = React.useCallback( function unScheduleRemoval ( id ) {
		const taskIndex = scheduledTasks.current.findIndex( e => {
			return e.action === "REMOVE" && e.id === id
		} )
		if ( taskIndex === -1 ) {
			return
		}
		clearTimeout( scheduledTasks.current[ taskIndex ].timeoutId )
		scheduledTasks.current = splice( scheduledTasks.current, taskIndex )
	}, [ ] )

	const removeMessage = React.useCallback( function removeMessage ( id ) {
		messages.current = messages.current.filter( e => e.id !== id )
	}, [ ] )

	const makeToast = React.useCallback( function makeToast ( { content, type, topic, onAdd, onRemoval } ) {
		/*
		 | Determine toast duration
		 |
		 */
		let contentLength = content.length
		if ( React.isValidElement( content ) ) {
			const domElement = document.createElement( "div" )
			domElement.innerHTML = renderToString( content )
			contentLength = domElement.innerText.length
		}
		else if ( isAString( content ) ) {
		}
		else if ( isAnObject( content ) && ( content.heading || content.copy ) ) {
			contentLength = ( content.heading + " " + content.copy ).length
		}
		else {
			return
		}
		const displayDuration = ( 1.5 /* buffer */ + Math.floor( contentLength / 15 ) ) * 1000

		/*
		 | Make the toast
		 |
		 */
		let options = {
			// duration: type === "loading" ? ONE_HOUR : displayDuration,
			duration: ONE_HOUR,
			onDismiss: onRemoval,
				// ^ remove the toast from our state
			onAutoClose: onRemoval,
				// ^ remove the toast from our state
		}
		if ( isNonBlankString( topic ) ) {
			options.id = topic
				// make the topic the toast's id
			unScheduleRemoval( topic )
				// ^ if any pre-existing messages with the same topic
				// 	are present and scheduled to be removed,
				// 	un-schedule their removal
		}
		return toast.custom( t => {
			onAdd( t )
				// ^ run the "add" event hook
			if ( type !== "loading" ) {
				// ^ messages of type "loading" do not auto-close
				scheduleRemoval( t, displayDuration, onRemoval )
			}
			return <Message type={ type } onRemove={ () => toast.dismiss( t ) }>
				{ content }
			</Message>
		}, options )
	}, [ ] )


	let contextValue = {
		messages,
		addMessage,
	}

	return <MessagesContext.Provider value={ contextValue }>
		{ children }
	</MessagesContext.Provider>
}

function useMessagesContext () {
	return React.useContext( MessagesContext )
}





export { MessagesProvider, useMessagesContext }
