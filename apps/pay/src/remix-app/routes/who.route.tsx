
import type { MetaFunction } from "@remix-run/node"

export const meta: MetaFunction = () => {
	return [
		{ title: "Who" },
	]
}

export default function () {
	return <h5 className="bg-purple-3">who?</h5>
}
