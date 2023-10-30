
import * as React from "react"
import {
	Form,
} from "@remix-run/react"
import { useMachine } from "@xstate/react"
import { useForm } from "react-hook-form"

import { useUID } from "@twilio-paste/uid-library"

import { Stack } from "@twilio-paste/core/stack"
import { Box } from "@twilio-paste/core/box"
import { Label } from "@twilio-paste/core/label"
import { HelpText } from "@twilio-paste/core/help-text"
import { Input } from "@twilio-paste/core/input"
import { Toaster } from "@twilio-paste/core/toast"
import { useToaster } from "~/components/twilio-paste-overrides"
import { Button } from "~/components/twilio-paste-overrides"

import { LoginFormMachine } from "~/state-machines/LoginFormMachine"



export default function () {
	const formRef = React.useRef( null )
	const [ state, send ] = useMachine( LoginFormMachine, { context: { formRef } } )
	const { register, handleSubmit, formState: { errors } } = useForm()

	const { toaster } = useEffects( state )

	return <>
		<Form ref={formRef} method="POST" action="/api/v1/users/set_password" style={{ maxWidth: "240px" }} onSubmit={ handleSubmit( data => send( { type: "SUBMIT", data } ) ) }>
			<fieldset disabled={!state.matches( "idle" )} style={{ margin: 0, border: "none", padding: 0 }}>
				<Stack orientation="vertical" spacing="space70">
					<Box margin="space100">
						<img src="/media/logos/color/logo-bursar-color.svg" />
					</Box>
					<HelpText>Kindly set a new password</HelpText>
					<UserNewPasswordInput name="newPassword" register={register} error={errors}  />
					{ ( state.matches( "idle" ) && state.context.responseError ) && <>
						<HelpText variant="error">{state.context.responseError}</HelpText>
					</> }
					<Button variant="primary" type="submit" loading={!state.matches( "idle" )} fullWidth>Set Password</Button>
				</Stack>
			</fieldset>
		</Form>
		<Toaster {...toaster} />
	</>
}



function UserNewPasswordInput ( { name, register, onUpdate, error, ...props } ) {
	const inputId = useUID()
	const ariaId = useUID()

	const validation = { required: "A password must be provided" }

	return <Box {...props}>
		<Label htmlFor={inputId}>New Password</Label>
		<Input aria-describedby={ariaId} id={inputId} type="password" {...register( name, validation )} />
		{ error[ name ]?.message && <>
			<HelpText variant="error" id={ariaId}>{ error[ name ]?.message }</HelpText>
		</> }
	</Box>
}



function useEffects ( state ) {
	const toaster = useToaster()

	React.useEffect( function () {
		if ( ! state.matches( "done" ) )
			return;
		window.location.pathname = "/login"
		// navigate( "/login" )
	}, [ state.matches( "done" ) ] )

	React.useEffect( function () {
		if ( ! state.matches( "idle" ) )
			return;
		if ( ! state.context.requestError )
			return;
		toaster.push( buildErrorToast( state.context.genericErrorMessage ) )
	}, [ state.context.requestError ] )

	React.useEffect( function () {
		if ( ! state.matches( "idle" ) )
			return;
		toaster.push( buildErrorToast( state.context.responseError ) )
	}, [ state.context.responseError ] )

	return { toaster }
}

function buildErrorToast ( message ) {
	return {
		id: "formSubmissionError",
		variant: "error",
		message,
		dismissAfter: 5000,
	}
}
