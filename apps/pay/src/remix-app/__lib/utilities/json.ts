
export function safeJSONParse ( json ) {
	try {
		return JSON.parse( json )
	}
	catch ( e ) {
		return e
	}
}
