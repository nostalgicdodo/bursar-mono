
import path from "node:path"

import { findUpSync } from "find-up"

const packageJSONPath = findUpSync( "package.json" )

export function getAppDirectory () {
	if ( ! packageJSONPath )
		throw new Error( "Could not determine the app directory." )
	return path.resolve( packageJSONPath, ".." )
}

export function getUserMediaDirectory () {
	return path.resolve( getAppDirectory(), "environment/content/user/media" )
}
