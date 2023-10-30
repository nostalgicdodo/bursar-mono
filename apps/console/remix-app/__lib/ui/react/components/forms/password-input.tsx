
import * as React from "react"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"


import { getValueFromEventObject } from "@/utils/forms"
import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utils/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import getKeyCodeAndAlias from "@/utils/functions/get-key-code-and-alias"

type PasswordInputProps = {
	size: "regular" | "large";
	format: string;
	prefix: React.ReactNode;
	realtimeSync: boolean;
}
const PasswordInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<"input"> & Partial<PasswordInputProps>
>( function ( { name = "", id, placeholder, size = "regular", className = "", defaultValue, prefix, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef()
	const nodeRef = ref ?? internalRef

	const { useFormState, disable } = useFormContext()
	const [ value, setFormState ] = useFormState( name )

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


	const [ showPassword, setShowPassword ] = React.useState( false )
	// When the "Show Password" button is focused, and characters are inputted, redirect back to the input
	const showPasswordButtonOnKeyDown = React.useCallback( function ( event ) {
		const { keyAlias, keyCode } = getKeyCodeAndAlias( event )
		// If it's a _space_, ignore
		if ( keyCode === 32 || keyAlias === " " ) {
			return
		}
		// If it's a _function_ key, ignore
		if (
			( keyCode >= 112 && keyCode <= 123 )
			|| ( keyAlias.length <= 3 && /f\d/.test( keyAlias ) )
		) {
			return
		}

		// If it's a regular character, or a backspace, redirect to the input
		if (
			keyAlias.length <= 2
			|| ( keyCode === 8 || keyAlias === "backspace" )
		) {
			nodeRef.current?.focus()
		}
	}, [ ] )




	const styles = {
		regular: "h-150 p",
		large: "h-150 p md:h-250 md:leading-150 md:h5",
	}

	return <div key={ key.toString() } className={ `inline-flex px-50 rounded-25 bg-white input-shadow focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ styles[ size ] } ${ className }` }>
		{ prefix && <span className="inline-flex items-center pr-min pointer-events-none">{ prefix }</span> }
		<input
			ref={ nodeRef }
			name={ name }
			placeholder={ placeholder }
			disabled={ disable }
			type={ showPassword ? "text" : "password" }
			id={ id }
			className={ `appearance-none grow w-full h-full border-none p-0 bg-transparent text-[length:inherit] ${ showPassword ? "" : "tracking-[7px] -mr-[11px]" /* margin for Firefox */ } outline-none focus:ring-transparent | placeholder-neutral-2 | disabled:text-neutral-4` }
			defaultValue={ initialValue }
			onBlur={ event => {
				setFormState( name, getValueFromEventObject( event ) )
			} }
			{ ...props }
		/>
		<button type="button" className="inline-flex items-center pl-min text-neutral-4 hover:text-neutral-5 focus:text-neutral-5 focus:scale-125 focus:outline-none transition-transform duration-200" onClick={ () => setShowPassword( v => !v ) } onKeyDown={ showPasswordButtonOnKeyDown }>
			{ showPassword && <EyeIcon className="w-75"/> }
			{ showPassword && <span className="sr-only">Hide password</span> }
			{ !showPassword && <EyeSlashIcon className="w-75"/> }
			{ !showPassword && <span className="sr-only">Show password</span> }
		</button>
	</div>
} )



export default PasswordInput
