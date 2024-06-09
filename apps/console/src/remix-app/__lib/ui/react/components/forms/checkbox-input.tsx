
import * as React from "react"

import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import { getValueFromEventObject } from "@/utilities/forms"

type CheckboxInputProps = {
	size: "regular" | "large";
	format: string;
}
const CheckboxInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<"input"> & Partial<CheckboxInputProps>
>( function ( { name = "", id, size = "regular", className = "", defaultChecked, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef()
	const nodeRef = ref ?? internalRef

	const { useFormState, disable } = useFormContext()
	const [ value, setFormState ] = useFormState<boolean>( name )

	const initialValue = value ?? defaultChecked ?? false

	// Set default state on mount and whenever field is re-set
	React.useEffect( function () {
		if ( isNullOrUndefined( value ) && nodeRef.current.checked ) {
			setFormState( name, nodeRef.current.checked )
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

		if ( nodeRef.current.checked !== value ) {
			nodeRef.current.checked = value ?? false
		}
	}, [ value ] )



	const styles = {
		regular: "w-75 h-75",
		large: "w-75 h-75 md:w-125 h-125",
	}

	// return <div key={ key.toString() } className={ `inline-flex px-50 rounded-25 bg-white shadow-inset-1 focus-within:shadow-orange-2 focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ styles[ size ] } ${ className }` } tabIndex={ -1 } onFocus={ () => nodeRef.current.focus() }>
	return <div key={ key.toString() } className={ className } tabIndex={ -1 } onFocus={ () => nodeRef.current?.focus() }>
		<input
			ref={ nodeRef }
			name={ name }
			disabled={ disable }
			type="checkbox"
			id={ id }
			className={ `rounded border-neutral-2 text-orange-2 focus:ring-orange-2 ${ styles[ size ] }` }
			defaultChecked={ initialValue }
			onBlur={ event => {
				setFormState( name, getValueFromEventObject( event ) )
			} }
			{ ...props }
		/>
	</div>
} )



export default CheckboxInput
