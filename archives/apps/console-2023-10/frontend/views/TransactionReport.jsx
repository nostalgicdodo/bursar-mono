
import * as React from "react"
import { useMachine } from "@xstate/react"
import { LogViewerMachine } from "~/state-machines/LogViewerMachine"
import { useUID } from "@twilio-paste/uid-library"
import { Box } from "@twilio-paste/core/box"
import { Text } from "@twilio-paste/core/text";
import { Button } from "~/components/twilio-paste-overrides"
import { Input } from "@twilio-paste/core/input"
import { Label } from "@twilio-paste/core/label"
import { Select, Option } from "@twilio-paste/core/select"
import { Separator } from "@twilio-paste/core/separator"
import { Spinner } from "@twilio-paste/core/spinner"

import { FilterIcon } from "~/server/proxies/icons"
import { SearchIcon } from "~/server/proxies/icons"
import { ExportIcon } from "~/server/proxies/icons"

import { LoadingIndicator } from "@ui/components/loading-indicator"
import { Pagination } from "~/components/data-grid/pagination"

import { TheDataGrid } from "~/views/TheDataGrid";
import { EmptyState } from "~/views/EmptyState";
import { DateTimePopover } from "~/views/DateTimePopover";

export function TransactionReport () {
	const [ state, send, service ] = useMachine( LogViewerMachine )
	const isFetching = state.matches( "fetching-data" ) || state.matches( "exporting-data" )
	const isIdle = state.matches( "idle" )
	const filterFormRef = React.useRef( null )

	React.useEffect( function () {
		window._service = service
	}, [ ] )

	if ( state.matches( "fetching-data" ) && !state.context.data.length )
		return <LoadingIndicator />;

	const pageForward = () => send( { type: "PAGE_THROUGH", direction: "forwards" } )
	const pageBackward = () => send( { type: "PAGE_THROUGH", direction: "backwards" } )

	const filteredTableData = state.context.data || [ ]

	const handleClearAll = () => {
		reset(undefined, {
			keepTouched: false,
			keepSubmitCount: true
		});
		setAreButtonsDisabled(true);
	};

	return <>
		<Box as="form" ref={filterFormRef}>
			<Box display="flex" alignItems="flex-end" columnGap="space50">
				<Box>
					<StatusInput onChange={ e => send( { type: "FILTER_UPDATE", key: "status", value: e.target.value } ) } />
				</Box>
				<Box>
					<DateRangeInput onChange={ e => send( { type: "FILTER_UPDATE", key: "dateRange", value: e.target.value } ) } />
				</Box>
				<Box display="flex" columnGap="space50" paddingLeft="space40">
					<Button
						variant="primary"
						aria-label="Apply filters"
						disabled={false}
						onClick={ e => send( { type: "FILTER_COMMIT" } ) }
						data-cy="custom-filter-group-apply-button"
						loading={isFetching}
					>
						<FilterIcon decorative />
						Apply
					</Button>
					<Button
						variant="link"
						disabled={false}
						onClick={ e => { send( { type: "RESET" } ); filterFormRef.current.reset(); } }
						data-cy="custom-filter-group-clear-button"
					>
						Reset
					</Button>
					{ isFetching &&
						<Spinner title="Loading" size="sizeIcon70" color="colorBackgroundPrimary" decorative={false} />
					}
				</Box>
			</Box>
		</Box>
		<Box>
			<Box paddingY="space50">
				<Separator orientation="horizontal" />
			</Box>
			<Box display="flex" justifyContent="space-between">
				<Box width="size40">
					<SearchInput onSubmit={ inputRef => {
						const query = inputRef.current?.value.trim()
						if ( ! query )
							return;
						filterFormRef.current.reset()
						send( { type: "SEARCH", key: "search", value: query } )
					} } />
				</Box>
				<Button variant="secondary" onClick={ e => send( { type: "EXPORT_DATA" } ) }>
					<ExportIcon decorative />
					Export CSV
				</Button>
			</Box>
			<Box paddingTop="space50">
				{ filteredTableData.length > 0 ? <TheDataGrid data={filteredTableData} showDateTime /> : <EmptyState handleClearAll={handleClearAll} /> }
			</Box>
			<Box display="flex" justifyContent="center" marginTop="space70">
				<Pagination pageForward={ pageForward } pageBackward={ pageBackward } fetching={ isFetching } pageKeys={ state.context.pageKeys } isLastPage={ state.context.isLastPage } />
			</Box>
		</Box>
	</>
}



function StatusInput ( { onChange, disabled } ) {
	const inputId = useUID()
	return <>
		<Label htmlFor={inputId}>Status</Label>
		<Select id={inputId} onChange={onChange}>
			<Option value="">All</Option>
			<Option value="success">Successful</Option>
			<Option value="failed">Un-completed</Option>
			<Option value="unresolved">Unresolved</Option>
		</Select>
	</>
}

function DateRangeInput ( { onChange, disabled } ) {
	const DATE_TIME_RANGES = [
		{ label: "All time", value: "" },
		{ label: "Today", value: "today" },
		{ label: "Yesterday", value: "yesterday" },
		{ label: "Last 7 days", value: "last-7-days" },
		{ label: "Last 30 days", value: "last-30-days" },
		{ label: "Custom", value: "custom" },
	]
	const selectInputRef = React.useRef( null )
	const setDateRangeToCustom = () => {
		const value = DATE_TIME_RANGES.slice( -1 )[ 0 ].value
		selectInputRef.current.value = value
		const event = { target: { value } }
		onChange( event )
	}
	const inputId = useUID()

	return <>
		<Label htmlFor={inputId}>Date range</Label>
		<Select id={inputId} ref={selectInputRef}
			onChange={onChange}
			insertAfter={
				<DateTimePopover
					onChange={setDateRangeToCustom}
					onApply={ (...args) => {
						setDateRangeToCustom(...args);
						onChange(...args);
					} }
				/>
			}
		>
			{DATE_TIME_RANGES.map((range, i) => (
				<Option value={range.value} key={i}>
					{range.label}
				</Option>
			))}
		</Select>
	</>
}

function SearchInput ( { onSubmit, disabled } ) {
	const inputRef = React.useRef( null )
	return <>
		<Input ref={inputRef} aria-label="Search" type="text" placeholder="Search by Student Id"
			insertAfter={
				<Button variant="link" onClick={() => onSubmit( inputRef )}>
					<SearchIcon decorative={false} title="Search" />
				</Button>
			}
		/>
	</>
}
