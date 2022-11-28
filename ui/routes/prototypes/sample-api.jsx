
import {
	json,
	createCookie
} from "@remix-run/node"

export async function loader () {
	let cookie = createCookie( "xyz" )
	return json( {
		code: 200,
		status: "ok-ish",
		message: "all good."
	}, { headers: {
		"Set-Cookie": await cookie.serialize( { who: "you?" } )
	} } )
}
