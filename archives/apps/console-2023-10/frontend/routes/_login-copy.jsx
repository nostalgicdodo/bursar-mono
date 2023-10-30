
import {
	redirect,
} from "@remix-run/node"
import * as React from "react"
import {
	Form,
	useNavigate,
} from "@remix-run/react"
import { useMachine } from "@xstate/react"
import {
	ClientOnly,
} from "remix-utils"
import { useForm } from "react-hook-form"

import { useUID } from "@twilio-paste/uid-library"

import { CustomizationProvider } from "@twilio-paste/core/customization"
import { Grid, Column } from "@twilio-paste/core/grid"
import { Flex } from "@twilio-paste/core/flex"
import { Stack } from "@twilio-paste/core/stack"
import { Box } from "@twilio-paste/core/box"
import { Text } from "@twilio-paste/core/text"
import { Label } from "@twilio-paste/core/label"
import { HelpText } from "@twilio-paste/core/help-text"
import { Input } from "@twilio-paste/core/input"
import { Toaster, useToaster } from "@twilio-paste/core/toast"
import { Button } from "~/components/twilio-paste-overrides"

import { LoginFormMachine } from "~/state-machines/LoginFormMachine"

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

export async function loader ( { context } ) {
	if ( context.session.user?.id )
		return redirect( "/dashboard" )
	return null
}

export default function () {
	const formRef = React.useRef( null )
	const [ state, send, service ] = useMachine( LoginFormMachine, { context: { formRef } } )
	const { register, handleSubmit, formState: { errors } } = useForm()
	const toaster = useToaster()
	const navigate = useNavigate()

	React.useEffect( function () {
		if ( ! state.matches( "done" ) )
			return;
		navigate( "/dashboard", { replace: true } )
	}, [ state.matches( "done" ) ] )

	React.useEffect( function () {
		window._service = service
		if ( ! state.matches( "idle" ) )
			return;
		if ( ! state.context.requestError )
			return;
		toaster.push( buildErrorToast( "There was an issue in logging in. Please try again later." ) )
	}, [ state.matches( "idle" ), state.context.requestError ] )

	return <CustomizationProvider baseTheme="light" theme={globalTheme}>
		<Grid>
			<Column span={[ 0, 0, 7 ]}>
				<div style={{ width: "100%", height: "100%", backgroundImage: `url( "/media/backgrounds/layered-waves-horizontally-stacked.svg" )`, backgroundRepeat: "no-repeat" }}></div>
			</Column>
			<Column span={[ 8, 8, 4 ]} offset={[ 2, 2, 0 ]}>
				<ClientOnly>
					{ () => <>
						<Flex vAlignContent="center" hAlignContent="center" minHeight="100vh" vertical>
							<Form ref={formRef} method="POST" action="/auth/login" style={{ maxWidth: "240px" }} onSubmit={ handleSubmit( data => send( { type: "SUBMIT", data } ) ) }>
								<fieldset disabled={!state.matches( "idle" )} style={{ margin: 0, border: "none", padding: 0 }}>
									<Stack orientation="vertical" spacing="space70">
										<Box margin="space100">
											<img src="/media/logos/color/logo-bursar-color.svg" />
										</Box>
										<UserEmailInput name="userId" register={register} error={errors}  />
										<UserPasswordInput name="password" register={register} error={errors}  />
										{ ( state.matches( "idle" ) && state.context.responseError ) && <>
											<HelpText variant="error">{state.context.responseError}</HelpText>
										</> }
										<Button variant="primary" type="submit" loading={!state.matches( "idle" )} fullWidth>Log in</Button>
									</Stack>
								</fieldset>
							</Form>
						</Flex>
						<Toaster {...toaster} />
					</> }
				</ClientOnly>
			</Column>
		</Grid>
	</CustomizationProvider>
}


function UserEmailInput ( { name, register, onUpdate, error, ...props } ) {
	const inputId = useUID()
	const ariaId = useUID()
	const validation = { required: "Email is required" }

	return <Box {...props}>
		<Label htmlFor={inputId}>Email address</Label>
		<Input aria-describedby={ariaId} id={inputId} type="text" placeholder="admin@institute.edu" {...register( name, validation )} />
		{ error[ name ]?.message && <>
			<HelpText id={ariaId}>{ error[ name ]?.message }</HelpText>
		</> }
	</Box>
}

function UserPasswordInput ( { name, register, onUpdate, error, ...props } ) {
	const inputId = useUID()
	const ariaId = useUID()

	const validation = { required: "Password is required" }

	return <Box {...props}>
		<Label htmlFor={inputId}>Password</Label>
		<Input aria-describedby={ariaId} id={inputId} type="password" {...register( name, validation )} />
		{ error[ name ]?.message && <>
			<HelpText id={ariaId}>{ error[ name ]?.message }</HelpText>
		</> }
	</Box>
}


function buildErrorToast ( message ) {
	return {
		id: "formSubmissionError",
		variant: "error",
		message,
		dismissAfter: 5000,
	}
}
