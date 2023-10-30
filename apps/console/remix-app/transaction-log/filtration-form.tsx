
/**
 |
 | Filtration form
 |
 | Allows the user to filter by status and date range
 |
 */

import * as React from "react"

import { Field, FormProvider, LogFormState, useFormContext } from "@/ui/react/context-providers/form"
import { isEmpty } from "@/utils/type-checking/meta"

import SelectInput from "@/ui/react/components/forms/select-input"
import DateInput from "@/ui/react/components/forms/date-input"
import ButtonPrimary from "@/ui/react/components/buttons/button-primary"
import Buttonless from "@/ui/react/components/buttons/button-less"
import ValidationErrorMessages from "@/ui/react/components/forms/validation-error-messages"

import formValidations from "./filtration-form-validation"
import { getUTCStartOfDate } from "@/utils/dates/getStartOfDate"
import useOnSubmit from "@/this/forms/WIP__useOnSubmit"






const FiltrationForm = React.forwardRef( function FiltrationForm ( { onSubmit: _onSubmit, onReset, className = "" }, ref ) {
	const _ref = React.useRef()
	const thisRef = ref || _ref
	const onSubmit = useOnSubmit( {
		formRef: thisRef,
		// messageTopic: "transactions/retrieval",
		validations: formValidations,
		handler: _onSubmit
	} )

	return <FormProvider ref={ thisRef }>
		{ ( { issues } ) => <>
			<Form
				issues={ issues }
				onSubmit={ onSubmit }
				onReset={ onReset }
				className={ className }
			/>
		</> }
	</FormProvider>
} )
export default FiltrationForm



function Form ( { issues, onSubmit, onReset, className = "" } ) {
	const { disable, resetFormState } = useFormContext()

	return <form onSubmit={ onSubmit } onReset={ () => { resetFormState(); onReset() } } className={ `grid gap-25 grid-cols-2 md:flex flex-wrap md:gap-50 items-end ${ className }` }>
		{/* <LogFormState className="p text-neutral-6" /> */}

		<Field name="status">
			{ ( name, fieldId, inputId ) => <div>
				<label className="block pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Status</label>
				<SelectInput name={ name } className="max-md:w-full" id={ inputId }>
					<option value="">All</option>
					<option value="success">Successful</option>
					<option value="failed">Un-completed</option>
					<option value="unresolved">Unresolved</option>
				</SelectInput>
				<ValidationErrorMessages issues={ issues[ name ] } className="absolute pl-25" />
			</div> }
		</Field>
		<Field name="timeframe">
			{ ( name, fieldId, inputId ) => <div>
				<label className="block pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>Date range</label>
				<SelectInput name={ name } className="max-md:w-full" id={ inputId }>
					<option value="">All time</option>
					<option value="today">Today</option>
					<option value="yesterday">Yesterday</option>
					<option value="last-7-days">Last 7 days</option>
					<option value="last-30-days">Last 30 days</option>
					<option value="custom">Custom</option>
				</SelectInput>
				<ValidationErrorMessages issues={ issues[ name ] } className="absolute pl-25" />
			</div> }
		</Field>
		<Field name="dateRange.start">
			{ ( name, fieldId, inputId ) => <div>
				<label className="block pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>From date</label>
				<CustomDateInput name={ name } inputId={ inputId } />
				<ValidationErrorMessages issues={ issues[ name ] } messages={{ INVALID: <>This cannot be ahead of the <b>To date</b></> }} className="absolute pl-25" />
			</div> }
		</Field>
		<Field name="dateRange.end">
			{ ( name, fieldId, inputId ) => <div>
				<label className="block pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>To date</label>
				<CustomDateInput name={ name } inputId={ inputId } />
				<ValidationErrorMessages issues={ issues[ name ] } messages={{ INVALID: <>This cannot be behind of the <b>From date</b></> }} className="absolute pl-25" />
			</div> }
		</Field>

		<ButtonPrimary type="submit" case="normal" className="md:-translate-y-[1px]" disabled={ disable }>Apply</ButtonPrimary>
		<Buttonless type="reset" case="normal" className="[&>span]:hover:shadow-[0_1px]" disabled={ disable }>
			<span className="shadow-purple-2">Reset</span>
		</Buttonless>

		<When_StartDate_Or_EndDate_Changes />
		<When_Timeframe_Changes />
	</form>
}

function CustomDateInput ( { name, inputId } ) {
	const { useFormState } = useFormContext()
	const [ , setFormState ] = useFormState( name )

	// This function has to run when the either the
	// 	`From date` or `To date` have been updated
	// 	*directly* and not *in-directly*
	const onChange = React.useCallback( function () {
		setFormState( {
			timeframe: "custom"
		} )
	}, [ ] )

	return <DateInput name={ name } className="max-md:w-full" placeholder="Select date" toDate={ new Date } id={ inputId } onChange={ onChange } />
}

function When_Timeframe_Changes () {
	const { useFormState } = useFormContext()
	const [ value, setFormState ] = useFormState( "timeframe" )

	React.useEffect( function () {
		if ( value === "custom" ) {
			return
		}

		const { start, end } = getDateRange( value )
		setFormState( {
			"dateRange.start": start && start.getTime(),
			"dateRange.end": end && end.getTime(),
		} )
	}, [ value ] )

	return null
}

function When_StartDate_Or_EndDate_Changes () {
	const { useFormState } = useFormContext()
	const [ startDate, setFormState ] = useFormState( "dateRange.start" )
	const [ endDate ] = useFormState( "dateRange.end" )

	React.useEffect( function () {
		if ( isEmpty( startDate ) || isEmpty( endDate ) ) {
			return
		}

		if ( startDate > endDate ) {
			setFormState( {
				"dateRange.start": endDate
			} )
		}
	}, [ startDate, endDate ] )

	return null
}





/*
 |
 | Helper functions
 |
 |
 */
function getDateRange ( rangeText ) {
	let range = {
		start: null,
		end: null
	}
	if (
		typeof rangeText !== "string"
		|| !rangeText.trim()
	) {
		return range
	}

	if ( rangeText === "today" ) {
		range.start = getUTCStartOfDate()
	}
	else if ( rangeText === "yesterday" ) {
		{
			const date = new Date
			range.end = getUTCStartOfDate( date )
		}
		{
			const date = new Date
			date.setDate( date.getDate() - 1 )
			range.start = getUTCStartOfDate( date )
		}
	}
	else if ( rangeText === "last-7-days" ) {
		// range.end = getUTCStartOfDate()

		const date = new Date
		date.setDate( date.getDate() - 7 )
		range.start = getUTCStartOfDate( date )
	}
	else if ( rangeText === "last-30-days" ) {
		const date = new Date
		date.setDate( date.getDate() - 30 )
		range.start = getUTCStartOfDate( date )
	}

	return range
}
