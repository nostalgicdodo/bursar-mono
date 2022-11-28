
import {
	redirect,
} from "@remix-run/node"
import {
	useMatches,
	Outlet,
} from "@remix-run/react"
import {
	ClientOnly,
} from "remix-utils"
import * as React from "react"

import { CustomizationProvider } from "@twilio-paste/core/customization"
import { Grid, Column } from "@twilio-paste/core/grid"
import { Flex } from "@twilio-paste/core/flex"

import globalTheme from "@ui/design-system/theme"
import { baseLinks } from "~/root"
import twilioPasteOverrideStyles from "~/css/twilio-paste-overrides.css"


export function links () {
	return baseLinks.concat(
		[
			{ rel: "preconnect", href: "https://assets.twilio.com", crossOrigin: "" },
			{ rel: "stylesheet", href: "https://assets.twilio.com/public_assets/paste-fonts/main-1.2.0/fonts.css" },
		],
		[
			twilioPasteOverrideStyles
		].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
	)
}

/*
 |
 | NOTE:
 | This loader runs not only for the "/login" route,
 | 	but for any nested routes;
 | 	for example, "/login/reset-password"
 |
 |
 */
export async function loader ( { request, context } ) {
	const urlPath = new URL( request.url ).pathname
	const user = context.session?.user
	console.log( user )
	// If the user is logged in...
	if ( user?.id ) {
		// and they are to have their password reset, then redirect to the "password reset" route
		// 	(if they are not already on it)
		if ( user.resetPassword ) {
			if ( ! urlPath.startsWith( "/login/reset-password" ) ) {
				return redirect( "/login/reset-password" )
			}
		}
		// Else, redirect them to the default logged-in route
		else {
			return redirect( "/dashboard" )
		}
	}
	// Else, if the user is not logged in,
	// 	and an inner page is being accessed,
	// 	then redirect them back to just the login route
	else if ( urlPath.slice( 1 ).includes( "/" ) ) {
		return redirect( "/login" )
	}
	return null
}

export default function () {
	return <CustomizationProvider baseTheme="light" theme={globalTheme}>
		<Grid>
			<Column span={[ 0, 0, 7 ]}>
				<div style={{ width: "100%", height: "100%", backgroundImage: `url( "/media/backgrounds/layered-waves-horizontally-stacked.svg" )`, backgroundRepeat: "no-repeat" }}></div>
			</Column>
			<Column span={[ 8, 8, 4 ]} offset={[ 2, 2, 0 ]}>
				<Flex vAlignContent="center" hAlignContent="center" minHeight="100vh" vertical>
					<ClientOnly>
						{ () => <Outlet /> }
					</ClientOnly>
				</Flex>
			</Column>
		</Grid>
	</CustomizationProvider>
}
