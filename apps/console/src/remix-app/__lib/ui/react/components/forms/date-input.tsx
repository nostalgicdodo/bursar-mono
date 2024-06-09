
import dayjs from "dayjs"
import * as React from "react"
import { DayPicker } from "react-day-picker"
import { CalendarDaysIcon } from "@heroicons/react/24/outline"

import { useFormContext } from "@/ui/react/context-providers/form"
import { isNullOrUndefined } from "@/utilities/type-checking/null-or-undefined"
import useMountKey from "@/ui/react/hooks/useMountKey"
import useHasBeenMountedBefore from "@/ui/react/hooks/useHasBeenMountedBefore"
import Popover from "@/ui/react/components/popover"
import noOp from "@/utilities/functions/no-op"

type DateInputProps = {
	toDate?: Date;
	fromDate?: Date;
	format?: string;
	suffix?: React.ReactNode;
	footer?: React.ReactNode | ( ( args?: any ) => React.ReactNode );
}
const DateInput = React.forwardRef<
	HTMLInputElement,
	DateInputProps & React.ComponentPropsWithoutRef<"input">
>( function ( { name = "", id, placeholder, size = "regular", className = "", defaultValue, fromDate, toDate, suffix, footer, onChange = noOp, ...props }, ref ) {
	const mountedBefore = useHasBeenMountedBefore()
	const [ key, resetKey ] = useMountKey()
	const internalRef = React.useRef()
	const nodeRef = ref ?? internalRef

	const { useFormState, disable } = useFormContext()
	const [ value, setFormState ] = useFormState( name )

	const initialValue = value ?? defaultValue ?? ""

	// Local state for the date picker
	const [ selected, setSelected ] = React.useState<Date | undefined>( function () {
		return initialValue ? new Date( initialValue ) : void 0
	} )

	function setSelectedDate ( v ) {
		if ( ! v ) {
			return
		}
		// Add or subtract the timezone difference to get the date in UTC
		v = new Date( v.getTime() + ( -1 * v.getTimezoneOffset() ) * 60 * 1000 )
		setSelected( v )
		setFormState( name, v.getTime() )
			// ^ for example, June 6th, 2025 = 1749168000000

		onChange.call( { setFormState }, v )
	}

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
			setSelected( void 0 )
			return
		}

		setSelected( new Date( value ) )
		// if ( nodeRef.current.value !== value ) {
		// 	nodeRef.current.value = value ?? ""
		// }
	}, [ value ] )


	const propsToDelegate = {
			// ^ to the DayPicker component
		fromDate: fromDate ?? new Date( -1893495600000 ),
			// ^ i.e. the year 1910
		toDate,
	}
	const contextValue = {
			// ^ for _render-prop_ components
			//  	(like the footer)
		selected: selected ? dayjs( selected ) : null,
	}

	return <Popover>
		<Popover.Trigger asChild={ true }>
			{/*
			  | Clicking on the prefix/suffix does not trigger the date picker.
			  | 	Hence, the input element is absolutely positioned to cover the entire area.
			  |
			  */}
			<div className={`relative inline-flex items-center h-150 p-0 px-50 rounded-25 bg-white input-shadow focus-within:ring-transparent focus-within:border-none transition-shadow duration-300 ${ className }`}>
				<span className="pr-min"><CalendarDaysIcon className="w-75 text-neutral-4" /></span>
				<input
					key={ key }
					ref={ nodeRef }
					name={ name }
					disabled={ disable }
					type="text"
					className="absolute inset-0 appearance-none w-full h-full border-none p-0 bg-transparent opacity-0 outline-none focus:ring-transparent | placeholder-neutral-2 | disabled:text-neutral-4"
					defaultValue={ initialValue }
					readOnly
					{ ...props }
				/>
				<span className="p grow whitespace-nowrap overflow-x-auto">{ selected ? dayjs( selected ).format( "MMMM D, YYYY" ) : placeholder }</span>
				{ suffix && <span className="pl-min">{ suffix }</span> }
			</div>
		</Popover.Trigger>
		<Popover.Content className="px-50 py-25 bg-white rounded-25 shadow-2 z-10" onClose={ () => nodeRef.current.focus() }>
			<DayPicker
				mode="single"
				numberOfMonths={ 1 }
				captionLayout="dropdown-buttons"
				// fromYear={ 1910 }
				showOutsideDays
				fixedWeeks
				selected={ selected }
				defaultMonth={ selected }
				onSelect={ setSelectedDate }
				footer={ <div style={{ marginTop: "var( --space-50 )", padding: "0 0.25em" }}>{ typeof footer === "function" ? footer( contextValue ) : footer }</div> }
				{ ...propsToDelegate }
			/>
		</Popover.Content>
	</Popover>
} )



export default DateInput
