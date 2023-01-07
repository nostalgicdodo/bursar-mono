
import { ErrorMessage } from "@hookform/error-message"
import { useUID } from "@twilio-paste/core/uid-library"
import { Box } from "@twilio-paste/core/box"
import { Button } from "~/components/twilio-paste-overrides"
import { DatePicker, formatReturnDate } from "@twilio-paste/core/date-picker"
import { Heading } from "~/components/twilio-paste-overrides"
import { HelpText } from "@twilio-paste/core/help-text"
import { Label } from "@twilio-paste/core/label"
import {
	PopoverContainer,
	Popover,
	PopoverButton,
	usePopoverState
} from "@twilio-paste/core/popover";
import { Text } from "@twilio-paste/core/text";

import { CalendarIcon } from "~/server/proxies/icons";



export function DateTimePopover ({
	onChange,
	onApply,
}) {
	const startId = `start-date-${useUID()}`;
	const endId = `end-date-${useUID()}`;
	const popoverId = `date-popover-${useUID()}`;

	const popover = usePopoverState({ baseId: popoverId });
	const [ dateRange, setDateRange ] = React.useState( {
		start: null,
		end: null,
	} )
	const [ errors, setErrors ] = React.useState( { } )
	const validateDateRange = () => {
		const errors = { }

		if ( ! dateRange.start )
			errors[ "range.start" ] = { message: "The start date is required." }
		if ( dateRange.end && dateRange.end <= dateRange.start )
			errors[ "range.end" ] = { message: "The end date has to be after the start date." }

		setErrors( errors )
		return ! Boolean( Object.keys( errors ).length )
	}

	return <PopoverContainer state={popover}>
		<PopoverButton
			variant="link"
			data-cy="custom-filter-group-popover-button"
		>
			<CalendarIcon decorative={false} title="Set custom date/time range" />
		</PopoverButton>
		<Popover aria-label="Custom date range" data-cy="custom-date-popover">
			<Heading as="h2" variant="heading40">
				Custom date range
			</Heading>
			<Box display="flex" flexDirection="column" marginBottom="space50" rowGap="space50">
				<Box display="flex" flexDirection="row" columnGap="space50">
					<Box width="100%">
						<Label htmlFor={`${startId}-date`}>
							Start date
						</Label>
						<DatePicker
							id={`${startId}-date`}
							aria-describedby={`${startId}-date-error`}
							onChange={ e => {
								onChange();
								const date = e.target.value
								if ( ! date )
									return;
								setDateRange( c => ({ ...c, start: formatReturnDate( e.target.value, "yyyy-MM-dd" ) }) );
							} }
							required
						/>
						<ErrorMessage
							errors={errors}
							name={"range.start"}
							render={({ message }) => (
								<HelpText
									variant="error"
									id={`${startId}-date-error`}
									data-cy="start-date-error"
								>
									{message}
								</HelpText>
							)}
						/>
					</Box>
				</Box>
				<Box display="flex" flexDirection="row" columnGap="space50">
					<Box width="100%">
						<Label htmlFor={`${endId}-date`}>
							End date
						</Label>
						<DatePicker
							id={`${endId}-date`}
							aria-describedby={`${endId}-date-error`}
							onChange={ e => {
								onChange();
								const date = e.target.value
								if ( ! date )
									return;
								setDateRange( c => ({ ...c, end: formatReturnDate( e.target.value, "yyyy-MM-dd" ) }) );
							} }
							required
						/>
						<ErrorMessage
							errors={errors}
							name="range.end"
							render={({ message }) => (
								<HelpText
									variant="error"
									id={`${endId}-date-error`}
									data-cy="end-date-error"
								>
									{message}
								</HelpText>
							)}
						/>
					</Box>
				</Box>
			</Box>
			<Button
				variant="primary"
				onClick={() => {
					if ( ! validateDateRange() )
						return;
					popover.hide();
					onApply( { target: { value: dateRange } } );
				}}
				data-cy="custom-filter-group-popover-apply-button"
			>
				Set range
			</Button>
		</Popover>
	</PopoverContainer>
}
