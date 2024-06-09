
import * as React from "react"

import { getValueFromEventObject } from "@/utilities/forms"
import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import { isABoolean } from "@/utilities/type-checking/boolean"

const objer = {
	x: "who",
	y: "?",
	z: ( v: number ) => v + 1,
}
type fnk = Pick<typeof objer, "z">[ "z" ]

type TextAreaInputProps = {
	size: "regular" | "large";
	format: string;
	realtimeSync: boolean;
}
const TextAreaInput = React.forwardRef<
	HTMLTextAreaElement,
	React.ComponentPropsWithoutRef<"textarea"> & Partial<TextAreaInputProps>
>( function ( { name = "", id, placeholder, size = "regular", className = "", defaultValue, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef<HTMLTextAreaElement>()
	const nodeRef = ref ?? internalRef

	let { useFormState, disable } = useFormContext()
		disable = isABoolean( props.disabled ) ? props.disabled : disable
	const [ value, setFormState ] = useFormState<string>( name )

	const initialValue = value ?? defaultValue ?? ""
	// const { initialValue, disable, realtimeSync, onBlur, onInput, onChange, setState, parsedProps } = useRelevantValues( name, defaultValue, props )
	// useAutoCorrectValueAsPerFormat( name, nodeRef )
	// const previousValue = React.useRef( null )

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
		regular: "p",
		large: "p md:leading-150 md:h5",
	}

	return <div key={ key.toString() } className={ `inline-flex p-50 rounded-25 bg-white shadow-inset-1 focus-within:shadow-orange-2 focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ styles[ size ] } ${ className }` } tabIndex={ -1 } onFocus={ () => nodeRef.current?.focus() }>
		<textarea
			ref={ nodeRef }
			name={ name }
			placeholder={ placeholder }
			disabled={ disable }
			id={ id }
			className="appearance-none grow w-full h-full border-none p-0 text-[length:inherit] bg-transparent outline-none focus:ring-transparent resize-none | placeholder-neutral-2 | disabled:text-neutral-4"
			defaultValue={ initialValue }
			onBlur={ event => {
				if ( disable ) {
					nodeRef.current.value = value
					return
				}
				setFormState( name, getValueFromEventObject( event ) )
			} }
			{ ...props }
		/>
	</div>
} )



export default TextAreaInput
