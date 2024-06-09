
import * as React from "react"

import { getValueFromEventObject } from "@/utilities/forms"
import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import { isAFunction } from "@/utilities/type-checking/function"
import { isABoolean } from "@/utilities/type-checking/boolean"
import identity from "@/utilities/functions/identity"

type TextInputProps = {
	size: "regular" | "large";
	// format: "unformatted" | "number" | "price";
	prefix: React.ReactNode;
	suffix: React.ReactNode;
	realtimeSync: boolean;
	displayValue: ( v: string ) => string;
}
const TextInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<"input"> & Partial<TextInputProps>
>( function ( { name = "", id, placeholder, size = "regular", className = "", defaultValue, displayValue = identity, prefix, suffix, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef()
	const nodeRef = ref ?? internalRef

	// console.log( `<Input/>: ${ name }: rendering` )

	// const { setState } = useFormContext()
	let { useFormState, disable } = useFormContext()
		disable = isABoolean( props.disabled ) ? props.disabled : disable
	const [ valueFromContext, setFormState ] = useFormState<string>( name )

	const initialValue = valueFromContext ?? defaultValue ?? ""
	const [ inputNodeValue, setInputNodeValue ] = React.useState( initialValue )
		// ^ this is for backing up the raw value provided by the user,
		// 	because the displayValue function will transform it
	// const { initialValue, disable, realtimeSync, onBlur, onInput, onChange, setState, parsedProps } = useRelevantValues( name, defaultValue, props )
	// useAutoCorrectValueAsPerFormat( name, nodeRef )
	// const previousValue = React.useRef( null )

	// Set default state on mount and whenever field is re-set
	React.useEffect( function () {
		if ( isNullOrUndefined( inputNodeValue ) && nodeRef.current.value ) {
			setInputNodeValue( nodeRef.current.value )
		}
		if ( isNullOrUndefined( valueFromContext ) && nodeRef.current.value ) {
			setFormState( name, nodeRef.current.value )
		}
	}, [ key ] )

	// Synchronize DOM node value to changes in the state that were made externally
	React.useEffect( function () {
		if ( ! mountedBefore ) {
			return
		}

		if ( isNullOrUndefined( valueFromContext ) ) {
			resetKey()
			return
		}

		if ( inputNodeValue !== valueFromContext ) {
			nodeRef.current.value = displayValue( valueFromContext ?? "" )
			setInputNodeValue( valueFromContext )
		}
		// if ( nodeRef.current.value !== valueFromContext ) {
		// 	nodeRef.current.value = valueFromContext ?? ""
		// }
	}, [ valueFromContext ] )



	const styles = {
		regular: "h-150 p",
		large: "h-150 p md:h-250 md:leading-150 md:h5",
	}

	return <div key={ key.toString() } className={ `inline-flex px-50 rounded-25 bg-white input-shadow focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ styles[ size ] } ${ className }` } tabIndex={ -1 } onFocus={ () => nodeRef.current?.focus() }>
		{ prefix && <span className="inline-flex items-center pr-min pointer-events-none">{ prefix }</span> }
		<input
			ref={ nodeRef }
			name={ name }
			placeholder={ placeholder }
			disabled={ disable }
			type="text"
			id={ id }
			className="appearance-none grow w-full h-full border-none p-0 text-[length:inherit] bg-transparent outline-none focus:ring-transparent | placeholder-neutral-2 | disabled:text-neutral-4"
			defaultValue={ displayValue( initialValue ) }
			onFocus={ event => {
				event.target.value = inputNodeValue
			} }
			onChange={ event => {
				if ( disable ) {
					return
				}
				if ( isAFunction( props.onChange ) ) {
					return props.onChange( event )
				}
			} }
			onBlur={ event => {
				if ( disable ) {
					nodeRef.current.value = displayValue( valueFromContext )
					return
				}
				const newValue = getValueFromEventObject( event )
				setFormState( name, newValue )
				setInputNodeValue( newValue )
				nodeRef.current.value = displayValue( newValue )
			} }
			{ ...props }
		/>
		{ suffix && <span className="inline-flex items-center pl-min pointer-events-none">{ suffix }</span> }
	</div>
} )



export default TextInput
