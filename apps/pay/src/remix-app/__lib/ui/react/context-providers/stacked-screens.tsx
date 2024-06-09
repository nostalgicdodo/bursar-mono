
/**
 |
 | Stacked Screen Context
 |
 | Exports a context provider and a <StackedScreen/> component.
 | Enclosing a component tree within a <StackedScreen/> component
 |	positions the aforementioned component tree in a manner
 |	such that it can easily be configured (through CSS)
 | 	to overlay on top of the current "active" screen on the stack.
 | Useful for building modals and dialogs. Can also accomodate
 | 	modals and dialogs that nest infinitely.
 |
 |
 */

import type { ReactNode } from "react"

import { createContext, useContext, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { isAFunction } from "@/utilities/type-checking/function"
import type { FunctionType } from "@/utilities/typescript-types/common-types"
import { isUndefined } from "@/utilities/type-checking/null-or-undefined"
import useLayoutEffect from "@/ui/react/hooks/useLayoutEffect"
import useRerender from "@/ui/react/hooks/useRerender"





const StackedScreenContext = createContext<any>( null )
StackedScreenContext.displayName = "StackedScreenContext"

type StackedScreenProviderProps = {
	children?: ReactNode;
}
type ScreenProps = Partial<{
	withinMainContentArea: boolean;
		// ^ (of the parent screen)
	className: string;
	children:
		| ReactNode
		| ( ( { mainContentAreaRef }: { mainContentAreaRef: FunctionType } ) => ReactNode )
			// ^ a ref to set the main content area of the current view
	;
}>

function StackedScreensProvider ( { children }: StackedScreenProviderProps ) {
	const [ screenStack, setScreenStack ] = useState( [ ] )

	const contextValue = {
		screenStack,
		setScreenStack,
	}

	return <StackedScreenContext.Provider value={ contextValue }>
		{ children }
	</StackedScreenContext.Provider>
}

function StackedScreen ( { withinMainContentArea = false, className = "", children = null }: ScreenProps ) {
	const { screenStack, setScreenStack } = useContext( StackedScreenContext )

	const screenNumber = useRef( screenStack.length + 1 )
	const ref = useRef<HTMLDivElement>()
	const id = `ss-${ useId() }`
	const [ mainContentAreaNode, setMainContentAreaNode ] = useState<HTMLElement | null>( null )

	// Determine the DOM node to portal the screen into
	const portalNode = useRef()
	const rerender = useRerender()
	useLayoutEffect( function () {
		if ( screenStack.length === 0 ) {
			return
		}

		const parentScreen = screenStack[ screenStack.length - 1 ]

		let anchorNode: HTMLElement
		if ( withinMainContentArea && parentScreen.mainContentAreaNode ) {
			anchorNode = parentScreen.mainContentAreaNode
		}
		else {
			anchorNode = parentScreen.ref.current
		}

		const screenContainerNode = createScreenContainer( className )
		anchorNode.parentNode.insertBefore( screenContainerNode, anchorNode )

		portalNode.current = screenContainerNode
		rerender()

		return function () {
			if ( portalNode.current ) {
				portalNode.current.parentNode.removeChild( portalNode.current )
				portalNode.current = void 0	// i.e. `undefined`, and **not** `null`
				// NOTE: I do not want to re-render when un-setting the portalNode,
				// 	hence the portalNode is a ref, and not a state var
			}
		}
	}, [ id ] )

	// Add the screen to the screen stack, on mount,
	// 	and remove it on un-mount
	useEffect( function () {
		setScreenStack( screens => screens.concat( {
			id,
			ref,
		} ) )

		return function () {
			const screenIndex = screenStack.findIndex( screen => screen.id === id )
			setScreenStack( screens => screens.slice( 0, screenIndex ) )
		}
	}, [ id ] )

	// Update the current screen
	// 	whenever its main content area node
	useEffect( function () {
		// YES, state is being derived in a useEffect hook.
		// 	Actually, this is the only way in this specific instance.
		setScreenStack( screens => {
			let screenIndex = screens.findIndex( screen => screen.id === id )
			if ( screenIndex === -1 ) {
				return screens
			}

			return screens
				.slice( 0, screenIndex )
				.concat( {
					...screens[ screenIndex ],
					mainContentAreaNode: mainContentAreaNode,
				} )
				.concat( screens.slice( screenIndex + 1 ) )
		} )
	}, [ id, mainContentAreaNode ] )

	// Update the portal node
	// 	(the main content area node is capable of being updated dynamically)
	// 	The portal node **can be** dependent on the parent screen's main content area node
	// TODO. MAYBE?

	if ( screenNumber.current > 1 && isUndefined( portalNode.current ) ) {
		// ^ if there are screens on the stack,
		// 	and the portal has not been determined yet, i.e. `undefined`
		// 	(If there no screens on the stack, then the screen must rendered synchronously for SSR)
		return null
	}
	else if ( portalNode.current ) {
		ref.current = portalNode.current
		return createPortal(
			isAFunction( children )
				? children( { mainContentAreaRef: setMainContentAreaNode } )
				: children,
			portalNode.current
		)
	}
	else {
		return <div ref={ ref } style={{ position: "relative" }} className={ className }>
			{ isAFunction( children ) ? children( { mainContentAreaRef: setMainContentAreaNode } ) : children }
		</div>
	}
}

function createScreenContainer ( className: string ) {
	let node = document.createElement( "div" )
	node.className = `stacked-screen relative w-full z-10 ${ className }`
	return node
}



export { StackedScreensProvider, StackedScreen }
