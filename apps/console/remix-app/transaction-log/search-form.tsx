
/**
 |
 | Search form
 |
 | Allows the user to filter by a student's id
 |
 */

import * as React from "react"

import { Field, FormProvider, useFormContext } from "@/ui/react/context-providers/form"

import ButtonPrimary from "@/ui/react/components/buttons/button-primary"
import Buttonless from "@/ui/react/components/buttons/button-less"
import ValidationErrorMessages from "@/ui/react/components/forms/validation-error-messages"

import formValidations from "./search-form-validation"
import TextInput from "@/ui/react/components/forms/text-input"
import useOnSubmit from "@/this/forms/WIP__useOnSubmit"
import useViewportWidth from "@/ui/react/hooks/useViewportWidth"
import viewportSizes from "@/ui/viewport-sizes"
import useLayoutEffect from "@/ui/react/hooks/useLayoutEffect"
import useOnlyOnWebBrowser from "@/ui/react/hooks/useOnlyOnWebBrowser"





const SearchForm = React.forwardRef( function SearchForm ( { onSubmit: _onSubmit, onReset, className = "" }, ref ) {
	const _ref = React.useRef()
	const thisRef = ref || _ref
	const onSubmit = useOnSubmit( {
		formRef: thisRef,
		// messageTopic: "transactions/retrieval",
		validations: formValidations,
		handler: _onSubmit
	} )

	return <FormProvider ref={ thisRef }>
		{ ( { issues } ) => <>
			<Form
				issues={ issues }
				onSubmit={ onSubmit }
				onReset={ onReset }
				className={ className }
			/>
		</> }
	</FormProvider>
} )
export default SearchForm

function Form ( { issues, onSubmit, onReset, className = "" } ) {
	const { disable, resetFormState } = useFormContext()
	const [ style, setStyle ] = React.useState( { } )
	const [ , viewportWidth ] = useViewportWidth()

	useLayoutEffect( function () {
		if ( viewportWidth >= viewportSizes.md ) {
			setStyle( { gridTemplateColumns: "repeat( auto-fit, minmax( 0, max-content ) )" } )
		}
		else {
			setStyle( { } )
		}
	}, [ viewportWidth ] )

	return <form onSubmit={ onSubmit } onReset={ () => { resetFormState(); onReset() } } className={ `grid gap-25 md:gap-50 md:place-items-end ${ className }` } style={ style } suppressHydrationWarning={ true }>
		<Field name="searchQuery">
			{ ( name, fieldId, inputId ) => <div>
				<label className="block pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Student Id</label>
				<TextInput name={ name } placeholder="" className="w-full" id={ inputId } />
				<ValidationErrorMessages issues={ issues[ name ] } className="absolute pl-25" />
			</div> }
		</Field>

		<div className="flex [&>*]:basis-1/2 _max-md:mt-50">
			<ButtonPrimary type="submit" case="normal" className="md:-translate-y-[1px]" disabled={ disable }>Search</ButtonPrimary>
			<Buttonless type="reset" case="normal" className="[&>span]:hover:shadow-[0_1px]" disabled={ disable }>
				<span className="shadow-purple-2">Reset</span>
			</Buttonless>
		</div>
	</form>
}
