
import {
	json,
} from "@remix-run/node"
import * as React from "react"

import { useMachine } from "@xstate/react"
import { TestStateMachine } from "@ui/state-machines/TestStateMachine"





export default function () {
	const [ state, send ] = useMachine( TestStateMachine, {
		context: {
			who: "me?"
		}
	} )

	return <div className="space-200">
		{ state.nextEvents.map(
			( e, _i ) => <button key={_i} onClick={() => send( e )} className="button fill-purple-1 text-purple-2 strong">{ e }</button>
		) }
		<pre><code>{ JSON.stringify( {
			value: state.value,
			context: state.context,
			state
		}, null, "\t" ) }</code></pre>
	</div>
}
