
import * as React from "react"

import { useMessagesContext } from "@/ui/react/context-providers/messages"
import { Field, FormProvider, useFormContext } from "@/ui/react/context-providers/form"
import { isEmpty, isNotEmpty } from "@/utilities/type-checking/meta"
import { isAnEmptyObject } from "@/utilities/type-checking/object"
import { getIssues } from "@/utilities/validation/get-issues"

import SelectInput from "@/ui/react/components/forms/select-input"
import ButtonPrimary from "@/ui/react/components/buttons/button-primary"
import Buttonless from "@/ui/react/components/buttons/button-less"
import ValidationErrorMessages from "@/ui/react/components/forms/validation-error-messages"

import formValidations from "./search-form-validation"
import TextInput from "@/ui/react/components/forms/text-input"
import noOp from "@/utilities/functions/no-op"






const SearchFormContainer = React.forwardRef( function SearchFormContainer ( { onCommit, onReset, className = "" }, ref ) {
	// const onSubmit = ( event, state ) => onCommit( { ...state } )
	const onFormSubmit = useFormSubmit( onCommit )
	return <FormProvider ref={ ref } submitHandler={ onFormSubmit } initial={ { } }>
		{ ({ fetcher, onSubmitHandler }) => <SearchForm form={ fetcher.Form } onSubmit={ onSubmitHandler } onReset={ onReset } className={ className } /> }
	</FormProvider>
} )
export default SearchFormContainer

function SearchForm ( { form, onSubmit, onReset, className = "" } ) {
	const Form = form
	const { issues } = useFormContext()

	// console.log( `<SearchForm />: render` )

	return <Form method="post" encType="multipart/form-data" onSubmit={ onSubmit } className={ `grid gap-25 md:grid-cols-[repeat(auto-fit,minmax(0,max-content))] md:place-items-end ${ className }` }>
		<Field name="searchQuery">
			{ ( name, fieldId, inputId ) => <div>
				<label className="block pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Student Id</label>
				<TextInput name={ name } placeholder="" className="" id={ inputId } />
				<ValidationErrorMessages issues={ issues[ name ] } className="absolute pl-25" />
			</div> }
		</Field>

		<div className="flex max-md:mt-50">
			<ButtonPrimary type="submit" case="normal" className="md:-translate-y-[1px]">Search</ButtonPrimary>
			<ResetButton onClick={ onReset } />
		</div>

		{/* <PrintState /> */}
	</Form>
}

function ResetButton ( { onClick = noOp, className = "" } ) {
	const { state, resetFormState } = useFormContext()
	return <Buttonless type="button" case="normal" className={ `[&>span]:hover:shadow-[0_1px] ${ className }` } onClick={ () => { resetFormState(); onClick() } }>
		<span className="shadow-purple-2">Reset</span>
	</Buttonless>
}





/*
 |
 | Helper functions
 |
 |
 */
const messageTopic = "transactions/retrieval"
function useFormSubmit ( onSubmit ) {
	const { addMessage } = useMessagesContext()
	return async function onFormSubmit ( event, state ) {
		const { fetcher, setIssues } = this
		const data = state

		// Validate
		const { thereAreIssues, details } = await getIssues( data, formValidations )
		setIssues( details )

		if ( thereAreIssues ) {
			return
				// ^ don't submit the form
		}

		onSubmit( data )
	}
}
