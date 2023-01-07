
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

import { CustomizationProvider } from "@twilio-paste/core/customization"

import { Grid, Column } from "@twilio-paste/core/grid"
import { Flex } from "@twilio-paste/core/flex"
import { Stack } from "@twilio-paste/core/stack"
import { Separator } from "@twilio-paste/core/separator"
import { Box } from "@twilio-paste/core/box"
import { Heading } from "~/components/twilio-paste-overrides"
import { Text } from "@twilio-paste/core/text"

import { Anchor } from "@twilio-paste/core/anchor"
import { Menu, MenuButton, MenuItem, MenuSeparator, useMenuState } from "@twilio-paste/core/menu"

import { HamburgerIcon } from "~/server/proxies/icons"

import globalTheme from "@ui/design-system/theme"
import { baseLinks } from "~/root"

import twilioPasteOverrideStyles from "~/css/twilio-paste-overrides.css"


function getPageTitle () {
	return useMatches().reverse().find( m => m.handle?.pageTitle )?.handle.pageTitle
}


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

export async function loader ( { context } ) {
	// If user **is not** logged in, redirect to the login screen
	if ( ! context.session.user?.id ) {
		return redirect( "/login" )
	}
	// If user *is* logged in, also redirect to the login screen if they are to have their password reset
	if ( context.session.user?.resetPassword ) {
		return redirect( "/login" )
	}
	// Else, do not redirect
	return null
}

export default function () {
	const pageTitle = getPageTitle()
	return <CustomizationProvider baseTheme="light" theme={globalTheme}>
		<ClientOnly>
			{ () => <>
				<div style={{ position: "sticky", top: "1rem", zIndex: 1 }}>
					<Box maxWidth="calc(var(--container-width) + 50px)" marginX="auto" backgroundColor="rgba( 226, 214, 248, 0.75 )" borderRadius="42px" boxShadow="rgb( 226 214 248 / 60% ) 0px 11px 16px -5px">
						<Box marginX="auto" marginBottom="space100" paddingX="space70" paddingY="space40">
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
								<img src="/media/logos/color/logo-bursar-color.svg" alt="" style={{ maxWidth: "100px" }} />
								<ThisMenu />
							</div>
						</Box>
					</Box>
				</div>
				<Box marginX="auto" maxWidth="var(--container-width)">
					{ pageTitle &&
						<Box marginBottom="space100" paddingTop="space100">
							<Heading as="h1" variant="heading10" marginBottom="space0">{pageTitle}</Heading>
							<Box marginBottom="space20"></Box>
							<Separator orientation="horizontal" />
						</Box>
					}
					<Outlet />
				</Box>
			</> }
		</ClientOnly>
	</CustomizationProvider>
}


function ThisMenu () {
	const menu = useMenuState()
	return <>
		<MenuButton {...menu} variant="reset" size="reset">
			<HamburgerIcon decorative={false} title="Menu" />
		</MenuButton>
		<Menu {...menu} aria-label="Preferences">
			<MenuItem {...menu} href="dashboard">Dashboard</MenuItem>
			<MenuItem {...menu} href="log">Log</MenuItem>
			{/* <MenuItem {...menu} href="account">Account</MenuItem> */}
			<MenuSeparator {...menu} />
			<MenuItem {...menu} href="auth/logout">Sign out</MenuItem>
		</Menu>
	</>
}
