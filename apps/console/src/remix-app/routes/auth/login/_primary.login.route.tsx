
import type {
	MetaFunction
} from "@remix-run/node"

import LoginView from "./view"





export const meta: MetaFunction = () => {
	return [
		{ title: "bursar" },
		{ name: "description", content: "console." },
	]
}

export const handle = {
	layout: {
		header: false
	},
}

export default function View () {
	return <LoginView />
}
