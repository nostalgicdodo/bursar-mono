
/*
 |
 |
 | Points to note:
 | 1. The onClose handler cannot be _consistently_ invoked with the window handle, hence it is *never* invoked with the window handle
 |
 */

export function Popup ( { name, href, size, onMount, onClose, onError, handleRef: parentHandleRef } ) {
	const [ state, dispatch ] = React.useReducer( reducer, getInitialState() )
	onMount = onMount || ( () => {} )
	onClose = onClose ? createOneTimeExecutionVersion( onClose ) : ( () => {} )
	onError = onError || ( () => {} )



	/*
	 |
	 | Attempt to open the window
	 |
	 |
	 */
	React.useLayoutEffect( function () {
	// React.useEffect( function () {
		const windowHandle = openPopupWindow( name, href, size )

		if ( windowHandle )
			dispatch( { type: "WINDOW_OPENED", handle: windowHandle } )
		else
			dispatch( { type: "WINDOW_DID_NOT_OPEN" } );

	}, [ name, href ] )



	/*
	 |
	 | If the window did open, set up all the provided event handlers
	 |
	 |
	 */
	React.useEffect( function () {
		if ( state.windowDidOpen === "TBD" )
			return;
		if ( state.windowDidOpen === false )
			return onError();
		onMount( state.windowHandle )
		return () => {
			// console.log( "Popup: Closing window, running onClose() [1/3]" )
			closeWindow( state.windowHandle )
			onClose()
			if ( typeof window._windowHandles === "object" )
				delete window._windowHandles[ name ]
		}
	}, [ state.windowDidOpen ] )



	/*
	 |
	 | If the window is closed, run the onClose handler and reset this component's state
	 |
	 |
	 */
	React.useEffect( function () {
		if ( !state.windowHandle )
			return;

		let timeoutId = null
		;( function checkIfWindowHasClosed/*Until it has closed*/ () {
			timeoutId = window.setTimeout( function () {
				// console.log( "Child window: Has it closed?" )

				if ( ! isWindowClosed( state.windowHandle ) )
					return checkIfWindowHasClosed();

				// console.log( "Child window: Has it closed? Yes." )
				onClose()
				dispatch( { type: "RESET" } )
			}, 250 )
		} )()

		return () => {
			// console.log( "Popup: Cleaning up timeouts and event handling [2/2]" )
			window.clearTimeout( timeoutId )
		}
	}, [ state.windowIsOpen ] )



	/*
	 |
	 | If the parent window closes, close the child window as well
	 |
	 |
	 */
	React.useEffect( function () {
		if ( !state.windowHandle )
			return;

		function onParentWindowClose () {
			return closeWindow( state.windowHandle )
		}

		window.addEventListener( "beforeunload", onParentWindowClose )

		return () => {
			// console.log( "Popup: Cleaning up event handling [3/3]" )
			window.removeEventListener( "beforeunload", onParentWindowClose )
		}
	}, [ state.windowIsOpen ] )



	/*
	 |
	 | If the user agent blocks the opening of the window
	 | 	constantly poll to check if the window has been manually allowed by the user.
	 |	How this is determined is as follows:
	 |	1. A global object `window._windowHandles` is set up on the parent window.
	 |	2. When the window opens, it stores a reference to itself on this global var.
	 |	3. Back over here, we keep polling this global var.
	 |	4. Once we find that the reference is set, that means that the user manually allowed the window to be opened.
	 |	5. We stop polling the global var.
	 |
	 |
	 */
	React.useEffect( function () {
		if ( [ "TBD", true ].includes( state.windowDidOpen ) )
			return;

		// This component can be instantiated more than once,
			// hence we could have multiple windows to track
		window._windowHandles = window._windowHandles || { }

		let timeoutId = null
		;( function checkIfWindowHasOpened/*Until it has opened*/ () {
			// console.log( "checking if window opened manually" )
			timeoutId = window.setTimeout( function () {
				if ( !window._windowHandles[ name ] )
					return checkIfWindowHasOpened();

				// console.log( "Okay. It has finally opened." )
				dispatch( { type: "WINDOW_OPENED", handle: window._windowHandles[ name ] } )
			}, 250 )
		} )()

		return () => {
			// console.log( "Popup: Cleaning up timeouts [{4}/3]" )
			window.clearTimeout( timeoutId )
		}
	}, [ state.windowDidOpen ] )



	return null
}

function reducer ( state, action ) {
	switch ( action.type ) {
		case "RESET": {
			return getInitialState()
		}
		case "WINDOW_DID_NOT_OPEN": {
			return {
				...state,
				windowDidOpen: false,
				windowIsOpen: false,
			}
		}
		case "WINDOW_OPENED": {
			return {
				...state,
				windowDidOpen: true,
				windowIsOpen: true,
				windowHandle: action.handle,
			}
		}
	}
}

function getInitialState () {
	return {
		windowDidOpen: "TBD",
		windowIsOpen: false,
		windowHandle: null,
	}
}

function createOneTimeExecutionVersion ( fn ) {
	return function ( ...args ) {
		if ( ! fn )
			return null;
		const returnValue = fn( ...args )
		fn = null
		return returnValue
	}
}

function closeWindow ( windowHandle ) {
	if ( isWindowClosed( windowHandle ) )
		return;
	return windowHandle.close()
}

function isWindowClosed ( windowHandle ) {
	if ( ! isWindow( windowHandle ) )
		return true;
	// windowHandle?.opener === window
	return windowHandle.closed
}

function isWindow ( windowHandle ) {
	if ( [ void 0, null ].includes( windowHandle ) )
		return false;
	// the below (commented) don't work as expected
		// if ( windowHandle instanceof Window )
		// if ( windowHandle?.constructor?.name === "Window" )
	if ( windowHandle.self !== windowHandle )
		return false;
	if ( ! windowHandle.self )
		return false;
	return true
}

function openPopupWindow ( name, href, size, alignment ) {
	size = size || "contained-portrait"
	alignment = alignment || null
	let windowHeight
	let windowWidth
	let offsetTop
	let offsetLeft

	if ( size.startsWith( "contained" ) ) {
		let idealWindowWidth
		let idealWindowHeight
		if ( size.endsWith( "portrait" ) ) {
			idealWindowWidth = 500
			idealWindowHeight = 640
		}
		else if ( size.endsWith( "landscape" ) ) {
			idealWindowWidth = 1100
			idealWindowHeight = 680
		}

		if ( window.screen.height > idealWindowHeight )
			windowWidth = idealWindowWidth
		else
			windowHeight = window.screen.height - 100

		if ( window.screen.width > idealWindowWidth )
			windowHeight = idealWindowHeight
		else
			windowWidth = window.screen.width - 100
	}
	else if ( size === "match" ) {
		windowWidth = window.outerWidth
		windowHeight = window.outerHeight
	}

	if ( alignment === null && size === "match" ) {
		offsetTop = window.screenTop
		offsetLeft = window.screenLeft
	}
	else {
		offsetTop = ( window.screen.height - windowHeight ) / 2
		offsetLeft = ( window.screen.width - windowWidth ) / 2
	}

	const windowFeatures = Object.entries( {
		scrollbars: "no",
		resizable: "no",
		status: "no",
		location: "no",
		toolbar: "no",
		menubar: "no",
		width: windowWidth,
		height: windowHeight,
		left: offsetLeft,
		top: offsetTop,
	} ).map( e => e.join( "=" ) ).join( "," )

	return window.open( href, name, windowFeatures )
}
