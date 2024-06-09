
import * as React from "react"

import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import { getValueFromEventObject } from "@/utilities/forms"
import ButtonPrimary from "../buttons/button-primary"
import ButtonSecondary from "../buttons/button-secondary"

type RadioGroupInputProps = {
	style: "plain" | "button";
	size: "regular" | "large";
	format: string;
}
const RadioGroupInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<"input"> & Partial<RadioGroupInputProps>
>( function ( { name = "", id, size = "regular", style = "plain", options, defaultValue, valueKey = "value", labelKey = "label", descriptionKey = "description", className = "", ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef()
	const nodeRef = ref ?? internalRef
	const internalId = React.useId()
	id = id ?? internalId

	const { useFormState, disable } = useFormContext()
	const [ value, setFormState ] = useFormState<boolean>( name )

	const initialValue = value ?? defaultValue ?? false

	// Set default state on mount and whenever field is re-set
	React.useEffect( function () {
		const selectedRadioDOM = nodeRef.current.querySelector( `input[name="${ name }"]:checked` )
		if ( isNullOrUndefined( selectedRadioDOM ) ) {
			return
		}
		if ( isNullOrUndefined( value ) && selectedRadioDOM.value ) {
			setFormState( name, selectedRadioDOM.value )
		}
	}, [ key ] )

	// Synchronize DOM node value to changes in the state that were made externally
	React.useEffect( function () {
		if ( ! mountedBefore ) {
			return
		}

		if ( isNullOrUndefined( value ) ) {
			resetKey()
			return
		}

		const radioDOM__withMatchingValue = nodeRef.current.querySelector( `input[name="${ name }"][value="${ value }"]` )
		if ( radioDOM__withMatchingValue && ( radioDOM__withMatchingValue.value !== value ) ) {
			radioDOM__withMatchingValue.checked = true
		}
	}, [ value ] )


	const onChangeHandler = function ( event ) {
		if ( ! event.target.checked ) {
			return
		}
		setFormState( name, event.target.value )
	}

	return <fieldset className={ className } id={ id } ref={ nodeRef }>
		{ options.map( ( { value: optionValue, label }, i ) => <React.Fragment key={ i }>
			{ style === "plain" && <>
				<input type="radio" name={ name } value={ optionValue } id={ id + "_" + i } defaultChecked={ optionValue === initialValue } className="-mt-min h-75 w-75 border-neutral-2 text-orange-2 focus:ring-orange-2" onChange={ onChangeHandler } />
				{ label && <label htmlFor={ id + "_" + i } className="ml-min text-neutral-6">{ label }</label> }
			</> }
			{ style === "button" && <>
				<input type="radio" name={ name } value={ optionValue } id={ id + "_" + i } defaultChecked={ optionValue === initialValue } className="sr-only" onChange={ onChangeHandler } />
				{ label && <>
					{ ( optionValue === value ) && <ButtonPrimary as="label" size={ size } htmlFor={ id + "_" + i } className="inline-block strong">{ label }</ButtonPrimary> }
					{ ( optionValue !== value ) && <ButtonSecondary as="label" size={ size } htmlFor={ id + "_" + i } className="inline-block strong text-orange-2">{ label }</ButtonSecondary> }
				</> }
			</> }
		</React.Fragment> ) }
	</fieldset>
} )



export default RadioGroupInput
