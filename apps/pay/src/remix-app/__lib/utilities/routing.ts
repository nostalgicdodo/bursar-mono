
import { isNotAString, isStringBlank } from "./type-checking/strings/identity"





const DEFAULT_REDIRECT = "/"

/**
 |
 | This should be used any time the redirect path is user-provided
 | (like the query string on the login page).
 | 	This avoids open-redirect vulnerabilities.
 | @param {string} to The redirect destination
 | @param {string} defaultRedirect The redirect to use if the to is unsafe.
 |
 |
 */
export function safeRedirect ( to?: FormDataEntryValue | null, defaultRedirect: string = DEFAULT_REDIRECT ) {
	if ( isNotAString( to ) || isStringBlank( to ) ) {
		return defaultRedirect
	}

	if ( ! to.startsWith( "/" ) || to.startsWith( "//" ) ) {
		return defaultRedirect
	}

	return to
}
