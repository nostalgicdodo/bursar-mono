
import { InfinitySpin } from "react-loader-spinner"

export default function LoadingIndicator ( { message } ) {
	if ( message !== "" )
		message = message || "Loading..."
	return <>
		<InfinitySpin color="#8A5CE5" />
		{ message ? <div className="h3 text-center text-indigo-3">{ message }</div> : null }
	</>
}
