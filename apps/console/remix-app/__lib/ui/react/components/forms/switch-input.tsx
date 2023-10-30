
import * as React from "react"
import * as Switch from "@radix-ui/react-switch"

import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utils/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"

type SwitchInputProps = {
	size: "regular" | "large";
	format: string;
	realtimeSync: boolean;
}
const SwitchInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<"input"> & Partial<SwitchInputProps>
>( function ( { name = "", id, placeholder, size = "regular", className = "", defaultChecked, prefix, suffix, ...props }, ref ) {
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
			nodeRef.current.checked = value ?? ""
		}
	}, [ value ] )



	const styles = {
		regular: "h-150 p",
		large: "h-150 p md:h-250 md:leading-150 md:h5",
	}

	return <div key={ key.toString() } className={ className } tabIndex={ -1 } onFocus={ () => nodeRef.current?.focus() }>
		<Switch.Root
			ref={ nodeRef }
			name={ name }
			defaultChecked={ initialValue }
			// id={ id }
			className="relative flex w-12 rounded-full border-2 border-transparent bg-neutral-1 focus:outline-none focus:ring-2 focus:ring-orange-1 focus:ring-offset-2 cursor-pointer transition-colors duration-200 ease-in-out data-[state=checked]:bg-orange-2"
			style={{ WebkitTapHighlightColor: 'rgba( 0, 0, 0, 0 )' }}
			onCheckedChange={ value => {
				setFormState( name, value )
			} }
		>
			<Switch.Thumb className="inline-block w-6 h-6 bg-white rounded-full ring-0 shadow transition-transform duration-200 ease-in-out will-change-transform data-[state=checked]:translate-x-5" />
		</Switch.Root>
	</div>
} )



export default SwitchInput
