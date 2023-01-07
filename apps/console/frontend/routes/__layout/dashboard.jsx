
import * as React from "react"
import { useMachine } from "@xstate/react"
import { Bar } from "react-chartjs-2"
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	// Title,
	// Tooltip,
	// Legend,
} from "chart.js"

import { useUID } from "@twilio-paste/uid-library"

import { Grid, Column } from "@twilio-paste/core/grid"
import { Flex } from "@twilio-paste/core/flex"
import { Stack } from "@twilio-paste/core/stack"
import { Separator } from "@twilio-paste/core/separator"
import { Box } from "@twilio-paste/core/box"
import { Heading } from "~/components/twilio-paste-overrides"
import { Text } from "@twilio-paste/core/text"
import { Label } from "@twilio-paste/core/label"
import { HelpText } from "@twilio-paste/core/help-text"
import { Input } from "@twilio-paste/core/input"
import { Button } from "~/components/twilio-paste-overrides"

import { FilterIcon } from "~/server/proxies/icons"
import theme from "@ui/design-system/theme"
import * as DT from "@twilio-paste/design-tokens"
import { DatePicker, formatReturnDate } from "@twilio-paste/core/date-picker"

import { StatisticsMachine } from "~/state-machines/StatisticsMachine"




ChartJS.register( {
	CategoryScale,
	LinearScale,
	BarElement,
	// Legend,
} )

import designTokenStyles from "@twilio-paste/design-tokens/dist/tokens.custom-properties.css"
import pageStyles from "./dashboard.css"


export const handle = {
	pageTitle: "Dashboard"
}

export function links () {
	return [
		designTokenStyles,
		pageStyles,
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}

export async function loader () {
	return null
}

export default function () {
	const [ state, send, service ] = useMachine( StatisticsMachine )
	const isSubmitting = state.matches( "submitting-data" )
	const isIdle = state.matches( "idle" )
	const todayStats = state.context.todayStats
	const ordersByDates = state.context.ordersByDates

	React.useEffect( function () {
		window._service = service
	}, [ ] )

	return <>
		<Box paddingBottom="space200">
			{/* <Box display="flex" alignItems="flex-end" columnGap="space50" marginBottom="space100">
				<InputDateRange />
				<Box display="flex" columnGap="space50" marginBottom="1px" paddingLeft="space40">
					<InputApplyFilters />
					<InputResetFilters />
				</Box>
			</Box> */}
			<div className="content-layout">
				{ ( typeof todayStats === "object" ) && <>
					<StatCard style={{ marginBottom: DT.space50 }}>
						<Heading as="h2" variant="heading20">Today's Payments</Heading>
						<div className="stats">
							<div>
								<Heading as="h3" variant="heading10" marginBottom="space0">{ todayStats.success || 0 }</Heading>
								<Text color="colorTextWeak">successful</Text>
							</div>
							<div>
								<Heading as="h3" variant="heading10" marginBottom="space0">{ todayStats.failed || 0 }</Heading>
								<Text color="colorTextWeak">uncompleted</Text>
							</div>
							<div>
								<Heading as="h3" variant="heading10" marginBottom="space0">{ ( todayStats.new || 0 ) + ( todayStats.initiated || 0 ) }</Heading>
								<Text color="colorTextWeak">in-progress</Text>
							</div>
						</div>
					</StatCard>
				</> }
				<div style={{ marginBottom: DT.space50 }}>
					<PaymentChart dataset={ordersByDates} />
				</div>
			</div>
		</Box>
	</>
}

function StatCard ( { children, ...props } ) {
	return <div className="stat-card" { ...props }>
		{ children }
	</div>
}

function PaymentChart ( { ...props } ) {
	const dataset = props.dataset
	if ( !dataset || !Object.keys( dataset ).length )
		return <></>

	const options = {
		responsive: true
	}

	let dates = Object.keys( dataset )
	const lastDataPoint = dates.slice( -1 )[ 0 ]
	const firstDataPoint = dates[ 0 ]
	let dataIsConfinedToASingleYear = firstDataPoint.slice( -4 ) === lastDataPoint.slice( -4 )
	let labels
	if ( dataIsConfinedToASingleYear )
		labels = dates.map( l => l.slice( 0, -5 ) )	// strip away the year
	else
		labels = dates

	const data = {
		labels,
		// labels: [ "13/08", "12/08", "11/08", "10/08", "09/08" ],
		datasets: [
			{
				label: "",
				data: Object.values( dataset ).map( e => e.length ),
				// data: [ 15, 27, 9, 14, 11 ],
				backgroundColor: theme.backgroundColors.colorBackgroundPrimary,
			}
		]
	}
	return <Box {...props}>
		<Heading as="h2" variant="heading20">Successful Payments</Heading>
		<Bar options={options} data={data} />
	</Box>
}



function InputApplyFilters ( { onClick, isSubmitting } ) {
	return <Button
		variant="primary"
		aria-label="Apply filters"
		onClick={onClick}
		loading={isSubmitting}
	>
		<FilterIcon decorative />
		Apply
	</Button>
}
function InputResetFilters ( { onClick, isSubmitting } ) {
	return <Button
		variant="link"
		onClick={onClick}
		loading={isSubmitting}
	>
		Reset
	</Button>
}
function InputDateRange ( { onChange } ) {
	const startId = `start-date-${useUID()}`;
	// const endId = `end-date-${useUID()}`;

	return <>
		<Box maxWidth="size20">
			<Label htmlFor={`${startId}-date`}>
				From
			</Label>
			<DatePicker
				id={`${startId}-date`}
				aria-describedby={`${startId}-date-error`}
				onChange={ e => {} }
				required
			/>
		</Box>
		{/* <Box maxWidth="size20">
			<Label htmlFor={`${endId}-date`}>
				To
			</Label>
			<DatePicker
				id={`${endId}-date`}
				aria-describedby={`${endId}-date-error`}
				onChange={ e => {} }
				required
			/>
		</Box> */}
	</>
}
