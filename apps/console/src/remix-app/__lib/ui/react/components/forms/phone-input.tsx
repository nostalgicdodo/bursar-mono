
import * as React from "react"

import type { PhoneCodeToRegionCode } from "@/this/types/phone-types"

import { isEmpty } from "@/utilities/type-checking/meta"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import { nonDigitRegex } from "@/utilities/regular-expressions"
import preventDefault from "@/utilities/functions/prevent-default"
import { getValueFromEventObject } from "@/utilities/forms"
import { useFormContext } from "@/ui/react/context-providers/form"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"

import { regionCodeToPhoneCode, phoneRegions } from "@/this/types/phone-types"
import { useRootContext } from "../../context-providers/root"





type PhoneInputProps = {
	size: "regular" | "large";
	defaultValue: [ keyof PhoneCodeToRegionCode, string ];
	suffix: React.ReactNode;
	realtimeSync: boolean;
}
const PhoneInput = React.forwardRef<
	HTMLInputElement,
	React.ComponentPropsWithoutRef<"input"> & Partial<PhoneInputProps>
>( function ( { name = "", id, placeholder, size = "regular", className = "", defaultValue, prefix, suffix, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	// const internalRef = React.useRef()
	// const nodeRef = ref ?? internalRef
	const regionCodeNodeRef = React.useRef()
	const subscriberNumberNodeRef = React.useRef()

	// console.log( `<Input/>: ${ name }: rendering` )

	const { environment: { REGION } } = useRootContext()

	// const { setState } = useFormContext()
	const { useFormState, disable } = useFormContext()
	const [ regionCode, setFormState ] = useFormState<string>( name + ".regionCode" )
	const [ subscriberNumber, ] = useFormState<string>( name + ".subscriberNumber" )

	const initialRegionCode = regionCode ?? defaultValue?.[ 0 ] ?? regionCodeToPhoneCode[ REGION ]
	const initialSubscriberNumber = subscriberNumber ?? defaultValue?.[ 1 ] ?? ""

	// Set default state on mount and whenever field is re-set
	React.useEffect( function () {
		if ( isNullOrUndefined( regionCode ) && regionCodeNodeRef.current.value ) {
			setFormState( name + ".regionCode", regionCodeNodeRef.current.value )
		}
		if ( isNullOrUndefined( subscriberNumber ) && subscriberNumberNodeRef.current.value ) {
			setFormState( name + ".subscriberNumber", subscriberNumberNodeRef.current.value )
		}
	}, [ key ] )

	// Synchronize DOM node value to changes in the state that were made externally
	React.useEffect( function () {
		if ( ! mountedBefore ) {
			return
		}

		if ( isNullOrUndefined( regionCode ) || isNullOrUndefined( subscriberNumber ) ) {
			resetKey()
			return
		}

		if ( regionCodeNodeRef.current.value !== regionCode ) {
			regionCodeNodeRef.current.value = regionCode ?? regionCodeToPhoneCode[ REGION ]
		}
		if ( subscriberNumberNodeRef.current.value !== subscriberNumber ) {
			subscriberNumberNodeRef.current.value = subscriberNumber ?? ""
		}
	}, [ regionCode, subscriberNumber ] )

	const styles = {
		regular: "h-150 p",
		large: "h-150 p md:h-250 md:leading-150 md:h5",
	}

	return <div key={ key.toString() } className={ `inline-flex px-50 rounded-25 bg-white shadow-inset-1 focus-within:shadow-orange-2 focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ styles[ size ] } ${ className }` } tabIndex={ -1 } onFocus={ () => subscriberNumberNodeRef.current?.focus() }>
		<div className={ `relative flex -ml-min mr-25 items-center max-md:basis-100 [&+*]:focus-within:before:bg-orange-1 [&+*]:focus-within:before:w-[1px] ${ size === "large" ? "md:px-min" : "" }` }>
			<div className="text-[length:inherit] tracking-widest" onClick={ () => subscriberNumberNodeRef.current?.focus() }>
				<span>{ "+" + ( regionCode ?? initialRegionCode ) }</span>
				{/* <ChevronDownIcon className="inline-block ml-min -mt-min w-50" /> */}
			</div>
			<select
				ref={ regionCodeNodeRef }
				disabled={ disable }
				className="absolute inset-0 p-0 text-[length:inherit] opacity-0"
				style={{ backgroundPositionX: "calc( 100% - var(--space-25) )" }}
				defaultValue={ initialRegionCode }
				onChange={ event => {
					const selectedRegion = phoneRegions.find( r => r[ 0 ] === ( "+" + event.target.value ) )
					if ( isEmpty( selectedRegion ) ) {
						return preventDefault( event )
					}
					setFormState( name + ".regionCode", selectedRegion[ 0 ]?.slice( 1 ) )
				} }
				data-field={ name }
			>
				{ phoneRegions.map( ( r, i ) => <option key={ i } value={ r[ 0 ].slice( 1 ) }>
					{ r[ 1 ] }
				</option> ) }
			</select>
		</div>
		<div className={ `relative grow pl-25 before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-full before:rounded-full before:bg-light before:scale-y-[.65] before:transition-all` }>
			<input
				placeholder={ placeholder }
				disabled={ disable }
				type="tel"
				inputMode="tel"
				ref={ subscriberNumberNodeRef }
				className="appearance-none grow w-full h-full border-none p-0 bg-transparent text-[length:inherit] tracking-widest outline-none focus:ring-transparent | placeholder-neutral-2 | disabled:text-neutral-4"
				defaultValue={ initialSubscriberNumber }
				onBlur={ event => {
					const subscriberNumber = getValueFromEventObject( event ).replace( nonDigitRegex, "" )
					setFormState( name + ".subscriberNumber", subscriberNumber )
				} }
				maxLength={ 19 }
				data-field={ name }
			/>
			{ suffix && <span className="inline-flex items-center pl-min pointer-events-none">{ suffix }</span> }
		</div>
	</div>
} )



export default PhoneInput
