
import * as React from "react"

import { useMessagesContext } from "@/ui/react/context-providers/messages"
import { Field, FormProvider, LogFormState, useFormContext } from "@/ui/react/context-providers/form"
import { isEmpty, isNotEmpty } from "@/utilities/type-checking/meta"
import { isAnEmptyObject } from "@/utilities/type-checking/object"
import { getIssues } from "@/utilities/validation/get-issues"

import SelectInput from "@/ui/react/components/forms/select-input"
import DateInput from "@/ui/react/components/forms/date-input"
import ButtonPrimary from "@/ui/react/components/buttons/button-primary"
import Buttonless from "@/ui/react/components/buttons/button-less"
import ValidationErrorMessages from "@/ui/react/components/forms/validation-error-messages"

import formValidations from "./filtration-form-validation"
import noOp from "@/utilities/functions/no-op"
import { getUTCStartOfDate } from "@/utilities/dates/getStartOfDate"
import usePreviousValue from "@/ui/react/hooks/usePreviousState"
import { getProperty } from "dot-prop"






const FiltrationFormContainer = React.forwardRef( function FiltrationFormContainer ( { onCommit, onReset, className = "" }, ref ) {
	// const onSubmit = ( event, state ) => onCommit( { ...state } )
	const onFormSubmit = useFormSubmit( onCommit )
	return <FormProvider ref={ ref } submitHandler={ onFormSubmit } initial={ { } }>
		{ ({ fetcher, onSubmitHandler }) => <FiltrationForm form={ fetcher.Form } onSubmit={ onSubmitHandler } onReset={ onReset } className={ className } /> }
	</FormProvider>
} )
export default FiltrationFormContainer

function FiltrationForm ( { form, onSubmit, onReset, className = "" } ) {
	const Form = form
	const { issues } = useFormContext()

	function onUpdating_FromDate_Or_ToDate () {
		this.setFormState( {
			timeframe: "custom"
		} )
	}

	// console.log( `<FiltrationForm />: render` )

	return <Form onSubmit={ onSubmit } className={ `grid gap-50 grid-cols-2 md:flex flex-wrap items-end ${ className }` }>
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
				<DateInput name={ name } className="max-md:w-full" placeholder="Select date" toDate={ new Date } id={ inputId } onChange={ onUpdating_FromDate_Or_ToDate }></DateInput>
				<ValidationErrorMessages issues={ issues[ name ] } messages={{ INVALID: <>This cannot be ahead of the <b>To date</b></> }} className="absolute pl-25" />
			</div> }
		</Field>
		<Field name="dateRange.end">
			{ ( name, fieldId, inputId ) => <div>
				<label className="block pl-0.5 p font-semibold text-neutral-4" htmlFor={ inputId }>To date</label>
				<DateInput name={ name } className="max-md:w-full" placeholder="Select date" toDate={ new Date } id={ inputId } onChange={ onUpdating_FromDate_Or_ToDate }></DateInput>
				<ValidationErrorMessages issues={ issues[ name ] } messages={{ INVALID: <>This cannot be behind of the <b>From date</b></> }} className="absolute pl-25" />
			</div> }
		</Field>

		<ButtonPrimary type="submit" case="normal" className="md:-translate-y-[1px]">Apply</ButtonPrimary>
		<ResetButton onClick={ onReset } />

		<When_Timeframe_Changes />
		<When_StartDate_Or_EndDate_Changes />
	</Form>
}

function ResetButton ( { onClick = noOp, className = "" } ) {
	const { state, resetFormState } = useFormContext()
	return <Buttonless type="button" case="normal" className={ `[&>span]:hover:shadow-[0_1px] ${ className }` } onClick={ () => { resetFormState(); onClick() } }>
		<span className="shadow-purple-2">Reset</span>
	</Buttonless>
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

	const previousStartDate = usePreviousValue( startDate )
	const previousEndDate = usePreviousValue( endDate )

	React.useEffect( function () {
		if ( isEmpty( startDate ) || isEmpty( endDate ) ) {
			return
		}

		if ( startDate > endDate ) {
			setFormState( {
				"dateRange.start": endDate
			} )
		}

		// // If the start date updated, and is ahead of the end date,
		// // 	then revert back to its previous value
		// if (
		// 	previousStartDate !== startDate
		// 	&& startDate > endDate
		// ) {
		// 	setFormState( {
		// 		"dateRange.start": previousStartDate
		// 	} )
		// }

		// // If the end date updated, and is behind the start date,
		// // 	then revert back to its previous value
		// if (
		// 	previousEndDate !== endDate
		// 	&& endDate < startDate
		// ) {
		// 	setFormState( {
		// 		"dateRange.end": previousEndDate
		// 	} )
		// }
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

const messageTopic = "transactions/retrieval"
function useFormSubmit ( onSubmit ) {
	const { addMessage } = useMessagesContext()
	return async function onFormSubmit ( event, state ) {
		const { fetcher, setIssues } = this
		const data = state

		// Validate
		const { thereAreIssues, details } = await getIssues( data, formValidations )
		setIssues( details )

		if ( thereAreIssues ) {
			return
				// ^ don't submit the form
		}

		onSubmit( data )
	}
}

function useOnResponse () {
	const { addMessage, removeByTopic } = useMessagesContext()
	return async function ( response, responseTime ) {
		removeByTopic( messageTopic )

		if (
			isEmpty( response )
			|| !( "ok" in response )
			|| ( !response.ok && isNotEmpty( response.issues ) && isAnEmptyObject( response.issues ) )
		) {
			addMessage( { content: "There seems to be an issue with the parameters you've provided. Kindly re-check and try again.", topic: messageTopic, type: "error" } )
			return
		}

		if (
			isEmpty( response )
			|| !( "ok" in response )
			|| ( !response.ok && response.statusCode >= 500 )
		) {
			addMessage( { content: `There was an issue in retrieving the data. Please try again in some time.`, topic: messageTopic, type: "error" } )
			return
		}

		if ( response.ok ) {
			// addMessage( { content: "Logging you in...", topic: messageTopic, type: "success" } )
			// navigate( `./dashboard`, { relative: "path", replace: true } )
		}
	}
}
