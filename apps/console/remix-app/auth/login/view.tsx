
import { useNavigate } from "@remix-run/react"

import { FormProvider, Field, LogFormState } from "@/ui/react/context-providers/form"
import { getIssues } from "@/utils/validation/get-issues"
import useOnSubmit from "@/this/forms/useOnSubmit"
import useOnResponse from "@/this/forms/useOnResponse"
import { isEmpty, isNotEmpty } from "@/utils/type-checking/meta"
import { isAnEmptyObject } from "@/utils/type-checking/object"
import { useMessagesContext } from "@/ui/react/context-providers/messages"
// import { Field, FormProvider, useFormContext } from "@/ui/react/context-providers/form-old"
import Log from "@/ui/react/components/log"
import TextInput from "@/ui/react/components/forms/text-input"
import ButtonPrimary from "@/ui/react/components/buttons/button-primary"
import ValidationErrorMessages from "@/ui/react/components/forms/validation-error-messages"

import formValidations from "./form-validation"
import PasswordInput from "@/ui/react/components/forms/password-input"
import CircularLoadingIndicator from "@/ui/react/components/loading-indictors/circular-loading-indicator"





export default function LoginView () {
	return <div className="relative max-h-screen overflow-hidden">
		<img src="/media/backgrounds/layered-waves-horizontally-stacked.svg" alt="" className="absolute max-lg:hidden" />
		<div className="container h-screen">
			<div className="mx-auto flex flex-col justify-center c-10 sm:c-8 md:c-5 lg:c-3 lg:c-offset-8 xl:c-offset-9 h-full">
				<h1 className="h1">
					<span className="sr-only">bursar</span>
					<img src="/media/logos/color/logo-bursar-color.svg" alt="bursar logo" className="mx-auto" />
				</h1>
				<FormSection className="mt-150" />
			</div>
		</div>
	</div>
}

function FormSection ( { className = "" } ) {
	const submitHandler = useOnSubmit( useOnSubmitOptions )
	const onResponse = useOnResponse( useOnResponseOptions )

	return <FormProvider method="POST" action="/auth/login" onResponse={ onResponse } submitHandler={ submitHandler } delayResponseBy={ 2.5 }>
		{ ({ onSubmit, disable, issues }) => <form onSubmit={ onSubmit } className={ className }>
			{/* <LogFormState className="p text-neutral-6" /> */}
			<div className="space-y-75">
				<Field name="userId">
					{ ( name, fieldId, inputId ) => <div>
						<label className="pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Email address</label>
						<TextInput name={ name } placeholder="admin@institute.edu" className="w-full" id={ inputId } disabled={ disable } autoFocus />
						<ValidationErrorMessages issues={ issues[ name ] } className="pl-25" />
					</div> }
				</Field>
				<Field name="password">
					{ ( name, fieldId, inputId ) => <div>
						<label className="pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Password</label>
						<PasswordInput name={ name } className="w-full" id={ inputId } disabled={ disable } />
						<ValidationErrorMessages issues={ issues[ name ] } className="pl-25" />
					</div> }
				</Field>

				{/* <ButtonPrimary type="submit" className="w-full">Log in</ButtonPrimary> */}
				<div className="mt-75 flex space-x-50">
					<ButtonPrimary className="grow" type="submit" disabled={ disable }>
						{ !disable && "Log in" }
						{ disable && <>
							<span className="sr-only">Verifying credentials</span>
							<span className="flex justify-center"><CircularLoadingIndicator className="inline-flex w-75 text-light" /></span>
						</> }
					</ButtonPrimary>
				</div>
			</div>
		</form> }
	</FormProvider>
}

function _FormContent ( { className = "" } ) {
	const { issues } = useFormContext()

	return <div className="space-y-75">
		<Field name="userId">
			{ ( name, fieldId, inputId ) => <div>
				<label className="pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Email address</label>
				<TextInput name={ name } placeholder="admin@institute.edu" className="w-full" id={ inputId } autoFocus />
				<ValidationErrorMessages issues={ issues[ name ] } className="pl-25" />
			</div> }
		</Field>
		<Field name="password">
			{ ( name, fieldId, inputId ) => <div>
				<label className="pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Password</label>
				<TextInput type="password" name={ name } placeholder="x x x x x x x x x x" className="w-full" id={ inputId } />
				<ValidationErrorMessages issues={ issues[ name ] } className="pl-25" />
			</div> }
		</Field>

		<ButtonPrimary type="submit" className="w-full">Log in</ButtonPrimary>
	</div>
}




/*
 |
 | Helpers
 |
 |
 */
const messageTopic = "user/login"
const useOnSubmitOptions = {
	messageTopic,
	formValidations,
	messages: {
		progress: "Verifying credentials..."
	}
}
const useOnResponseOptions = {
	messageTopic,
	onOk ({ addMessage, navigate }) {
		addMessage( "Welcome back!", { topic: messageTopic, type: "success" } )
		navigate( "/dashboard", { replace: true } )
	},
	messages: {
		clientIssue: { heading: "Issue with the information provided", copy: "Kindly re-check and try again" },
		notFoundIssue: { heading: "Incorrect credentials", copy: "Please review and try again." },
		serverIssue: { heading: "There is an issue.", copy: "We're unable to log you in. Please try again in some time." },
	}
}

// function useFormSubmit () {
// 	const { addMessage } = useMessagesContext()
// 	return async function onFormSubmit ( event, state ) {
// 		const { fetcher, setIssues } = this
// 		const data = state

// 		// Validate
// 		const { thereAreIssues, details } = await getIssues( data, formValidations )
// 		setIssues( details )

// 		if ( thereAreIssues ) {
// 			return
// 				// ^ don't submit the form
// 		}

// 		// Submit the form data
// 		fetcher.submit( data, {
// 			method: "post",
// 			encType: "application/json",
// 			action: "/auth/login?_source=ui",
// 			delayResponseBy: 1.9,
// 		} )

// 		addMessage( { content: "Verifying credentials...", topic: messageTopic, delayBy: 2.3, type: "progress" } )
// 	}
// }

// function _useOnResponse () {
// 	const { addMessage, removeByTopic } = useMessagesContext()
// 	const navigate = useNavigate()
// 	return async function ( response, responseTime ) {
// 		removeByTopic( messageTopic )

// 		if (
// 			isEmpty( response )	// if the response is empty
// 			|| !( "ok" in response )	// if there isn't an "ok" field in the response
// 			|| ( !response.ok && isNotEmpty( response.issues ) && isAnEmptyObject( response.issues ) )
// 				// ^ if the response is has an "issues" field, but its empty
// 		) {
// 			addMessage( { content: "There seems to be an issue with the information you've provided. Kindly re-check and try again.", topic: messageTopic, type: "error" } )
// 			return
// 		}

// 		if (
// 			isEmpty( response )	// if the response is empty
// 			|| !( "ok" in response )	// if there isn't an "ok" field in the response
// 			|| ( !response.ok && response.statusCode >= 500 )
// 				// ^ if the response's "statusCode" value is >= 500
// 		) {
// 			addMessage( { content: `There was an issue in verifying your credentials. Please try again in some time.`, topic: messageTopic, type: "error" } )
// 			return
// 		}

// 		if ( response.ok ) {
// 			addMessage( { content: "Logging you in...", topic: messageTopic, type: "success" } )
// 			const redirectTo = ( new URL( location.href ) ).searchParams.get( "redirectTo" ) ?? "/dashboard"
// 			navigate( redirectTo, { replace: true } )
// 		}
// 	}
// }
