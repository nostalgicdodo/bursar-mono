
import type {
	ActionFunction,
	LoaderFunction,
	MetaFunction
} from "@remix-run/node"

// import LoginView from "./view"




export const action: ActionFunction = ( { request, context } ) => {
	return context
}



// export const meta: MetaFunction = () => {
// 	return [
// 		{ title: "bursar" },
// 		{ name: "description", content: "console." },
// 	]
// }


// export default function View () {
// 	return <h1>
// 		log in.
// 	</h1>
// }
