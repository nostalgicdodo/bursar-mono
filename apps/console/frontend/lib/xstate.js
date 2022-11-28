
import { log } from "~/lib/logging"





export function logTransition ( name, scope ) {
	if ( ! name )
		throw new Error( "A name is required." );

	return function ( context, event ) {
		scope = scope || context?.logScope
		if ( !scope )
			return;

		// Should the `type` attribute be removed before logging?
		// const eventContext = { ...event }
		// delete eventContext.type

		return log( name, { ...context, __event: event }, scope )
	}
}
