
import * as React from "react"

import type { RegionCodes } from "@/this/types/regions-and-locations/regions"

import { getValueFromEventObject } from "@/utilities/forms"
import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import { nonDecimalPointNumberRegex, numberHavingMultipleDecimalPoints } from "@/utilities/regular-expressions"
import { isStringBlank } from "@/utilities/type-checking/strings/identity"

const REGION_TO_CURRENCY_SYMBOL = {
	US: "$",
	IN: "₹",
}

type PriceInputProps = {
	region: RegionCodes;
	size: "regular" | "large";
	suffix: React.ReactNode;
	realtimeSync: boolean;
}
const PriceInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<"input"> & Partial<PriceInputProps>
>( function ( { name = "", region, id, placeholder, size = "regular", className = "", defaultValue, suffix, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef()
	const nodeRef = ref ?? internalRef

	const { useFormState, disable } = useFormContext()
	const [ value, setFormState, unsetFormState ] = useFormState<string>( name )

	const initialValue = value ?? defaultValue ?? ""

	// Set default state on mount and whenever field is re-set
	React.useEffect( function () {
		if ( isNullOrUndefined( value ) && nodeRef.current.value ) {
			setFormState( name, nodeRef.current.value )
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

		if ( nodeRef.current.value !== value ) {
			nodeRef.current.value = value ?? ""
		}
	}, [ value, nodeRef.current?.value ] )
		// ^ the DOM input node's value is passed as a dependency
		// 	otherwise, if the DOM node is restored to the value
		// 	prior to it being formatted, then the `useEffect`
		// 	won't run again, as it only depends on the "formatted"
		// 	value, which would have stayed the same


	const styles = {
		regular: "h-150 p",
		large: "h-150 p md:h-250 md:leading-150 md:h5",
	}

	return <div key={ key.toString() } className={ `inline-flex px-50 rounded-25 bg-white shadow-inset-1 focus-within:shadow-orange-2 focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ styles[ size ] } ${ className }` } tabIndex={ -1 } onFocus={ () => nodeRef.current?.focus() }>
		{ ( region in REGION_TO_CURRENCY_SYMBOL ) && <span className="inline-flex items-center pr-min pointer-events-none">{ REGION_TO_CURRENCY_SYMBOL[ region ] }</span> }
		<input
			ref={ nodeRef }
			name={ name }
			placeholder={ placeholder }
			disabled={ disable }
			type="text"
			id={ id }
			className="appearance-none grow w-full h-full border-none p-0 text-[length:inherit] bg-transparent outline-none focus:ring-transparent | placeholder-neutral-2 | disabled:text-neutral-4"
			defaultValue={ initialValue }
			onBlur={ event => {
				const value = getValueFromEventObject( event )
				if ( isStringBlank( value ) ) {
					unsetFormState( name )
				}
				else {
					const formattedValue = parseFloat(
						parseFloat( value
							.replace( nonDecimalPointNumberRegex, "" )
							.replace( numberHavingMultipleDecimalPoints, "$1" )
						).toFixed( 2 )
					)
						// ^ the `toFixed` method only accepts a number and outputs a string
						// 	hence two instances of the `parseFloat` method
					setFormState( name, formattedValue )
				}
			} }
			{ ...props }
		/>
		{ suffix && <span className="inline-flex items-center pl-min pointer-events-none">{ suffix }</span> }
	</div>
} )



export default PriceInput
