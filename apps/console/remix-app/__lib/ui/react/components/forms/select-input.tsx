
import * as React from "react"

import { getValueFromDOMInput, getValueFromEventObject } from "@/utils/forms"
import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utils/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"

type SelectInputProps = {
	size: "regular" | "large";
	format?: string;
}
const SelectInput = React.forwardRef<
	HTMLInputElement,
	SelectInputProps & React.ComponentPropsWithoutRef<"input">
>( function ( { name = "", id, placeholder, size = "regular", className = "", defaultValue, displayValue, children, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef()
	const nodeRef = ref ?? internalRef

	const { useFormState, disable } = useFormContext()
	const [ value, setFormState ] = useFormState( name )

	// console.log( `<SelectInput />: ${ name }: render \t| ${ value }` )

	React.useImperativeHandle( ref, function () {
		return {
			reset ( value ) {
				const newValue = value || defaultValue || ""
				nodeRef.current.value = newValue
				setFormState( name, newValue )
				nodeRef.current.dispatchEvent( new Event( "change" ) )
			},
		}
	}, [ ] )

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
	}, [ value ] )



	const styles = {
		regular: "h-150 p",
		large: "h-150 p md:h-250 md:leading-150 md:h5",
	}

	return <div className={ `input-shadow | inline-flex rounded-25 bg-white focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ styles[ size ] } ${ className }` } tabIndex={ -1 } onFocus={ () => nodeRef.current.focus() }>
		<select
			key={ key }
			ref={ nodeRef }
			name={ name }
			disabled={ disable }
			id={ id }
			className="appearance-none grow w-full h-full border-none py-0 pl-50 pr-125 bg-transparent outline-none focus:ring-transparent leading-150 text-[length:inherit] | disabled:text-neutral-4"
			defaultValue={ initialValue }
			onChange={ event => {
				setFormState( name, getValueFromEventObject( event ) )
			} }
			{ ...props }
		>
			{ placeholder && <option value="" disabled>{ placeholder }</option> }
			{ children }
		</select>
		{ typeof displayValue === "function" && <span className="absolute top-min bottom-min left-50 right-125 flex items-center bg-inherit pointer-events-none">{ displayValue( currentValue ) }</span> }
	</div>
} )



export default SelectInput
