
/* DISCLAIMER: this is an example, not meant to be used in production */

import {
	useLocation,
	useResolvedPath
} from "@remix-run/react"
import { useHTTP } from "@ui/hooks/http"
import * as React from "react"
import { useForm, useFormState } from "react-hook-form"
import { isEqual } from "lodash"
import { useUID } from "@twilio-paste/uid-library"
import { Box } from "@twilio-paste/core/box"
import { Button } from "@twilio-paste/core/button"
import { Input } from "@twilio-paste/core/input"
import { Label } from "@twilio-paste/core/label"
import { Select, Option } from "@twilio-paste/core/select"
import { Separator } from "@twilio-paste/core/separator"

import { FilterIcon } from "~/server/proxies/icons"
import { SearchIcon } from "~/server/proxies/icons"
import { ExportIcon } from "~/server/proxies/icons"

import { LoadingIndicator } from "@ui/components/loading-indicator"
import { Pagination } from "~/components/data-grid/pagination"

import {
	DATE_TIME_RANGES,
	ROOM_TYPES,
	FORM_DEFAULT_VALUES
} from "~/data/table";
import {
	filterByDateTimeRange,
	filterByRoomType,
	filterBySearchString,
	isEndDateBeforeStartDate
} from "@ui/utils/dates";

import { TheDataGrid } from "~/views/TheDataGrid";
import { EmptyState } from "~/views/EmptyState";
import { DateTimePopover } from "~/views/DateTimePopover";

function reducer ( state, action ) {
	switch ( action.type ) {
		case "DATA_LOADED": {
			const nextPageKey = action.apiResponse?.LastEvaluatedKey || null
			return {
				...state,
				transactions: action.apiResponse?.Items || [ ],
				nextPageKey: nextPageKey,
			}
		}
		case "PAGE_FORWARD": {
			return {
				...state,
				pageKeys: state.pageKeys.concat( state.nextPageKey ),
				apiEndpoint: getAPIEndpoint( state.nextPageKey )
			}
		}
		case "PAGE_BACKWARD": {
			let nextPageKey
			if ( state.pageKeys.length <= 1 )
				nextPageKey = null
			else
				nextPageKey = state.pageKeys.slice( -2 )[ 0 ] || null

			return {
				...state,
				nextPageKey: nextPageKey,
				pageKeys: state.pageKeys.slice( 0, -1 ),
				apiEndpoint: getAPIEndpoint( nextPageKey )
			}
		}
		default: throw new Error( "Unknown action: " + action.type )
	}
}

function getInitialState () {
	return {
		apiEndpoint: getAPIEndpoint(),
		pageKeys: [ ],
		transactions: null,
		nextPageKey: null
	}
}

function getAPIEndpoint ( pageKey ) {
	const baseURL = window.location.origin + "/api/v1/t/list"
	const urlObject = new URL( baseURL )
	if ( pageKey !== null && typeof pageKey === "object" )
		urlObject.searchParams.set( "page", `${pageKey.id}:${pageKey.refUniqueId}` )
	return urlObject.toString()
}

export function TransactionReport () {
	const http = useHTTP()
	const [ state, dispatch ] = React.useReducer( reducer, getInitialState() )

	http.get( state.apiEndpoint )

	React.useEffect( function () {
		dispatch( { type: "DATA_LOADED", apiResponse: http.data } )
	}, [ http.data ] )

	// console.log( "BEFORE data loaded." )

	if ( ! state.transactions )
		return <LoadingIndicator />;

	// console.log( "AFTER data loaded." )

	const pageForward = () => dispatch( { type: "PAGE_FORWARD" } )
	const pageBackward = () => dispatch( { type: "PAGE_BACKWARD" } )

	// const dateRangesId = `quality-${useUID()}`;
	// const roomTypesId = `type-${useUID()}`;


	// const {
	// 	control,
	// 	handleSubmit,
	// 	register,
	// 	reset,
	// 	resetField,
	// 	setError,
	// 	setValue,
	// 	watch
	// } = useForm({
	// 	defaultValues: FORM_DEFAULT_VALUES,
	// 	criteriaMode: "all"
	// });
	// const { errors, dirtyFields, touchedFields } = useFormState({
	// 	control
	// });

	// console.log(dirtyFields, touchedFields);
	// const [ areButtonsDisabled, setAreButtonsDisabled ] = React.useState(true);
	// const [ filteredTableData, setFilteredTableData ] = React.useState( state.data );
	const filteredTableData = state.transactions || [ ]

	// React.useEffect( () => {
	// 	const subscription = watch((value, { name, type }) => {
	// 		const { customDate } = value;
	// 		console.log(value, name, type);
	// 		if (type === "change") {
	// 			setAreButtonsDisabled(false);

	// 			if (name?.includes("customDate") && value.range !== "custom") {
	// 				setValue("range", "custom");
	// 			}

	// 			if (name === "customDate.endDate") {
	// 				if (
	// 					customDate?.startDate &&
	// 					customDate?.startTime &&
	// 					customDate?.endDate &&
	// 					customDate?.endTime
	// 				) {
	// 					const isEndDateInvalid = isEndDateBeforeStartDate(
	// 						customDate.startDate,
	// 						customDate.startTime,
	// 						customDate.endDate,
	// 						customDate.endTime
	// 					);

	// 					if (isEndDateInvalid) {
	// 						setError("customDate.endDate", {
	// 							type: "custom",
	// 							message: "End date has to be after the start date."
	// 						});
	// 					}
	// 				}
	// 			}

	// 			if (
	// 				name === "range" &&
	// 				!isEqual(customDate, FORM_DEFAULT_VALUES.customDate)
	// 			) {
	// 				resetField("customDate");
	// 			}
	// 		}
	// 	});
	// 	return () => subscription.unsubscribe();
	// }, [ watch, setValue, resetField, setError ] )

	// const handleApplyFilters = (callback) => (formData) => {
	// 	const { search, type, range, customDate } = formData;
	// 	const { startDate, startTime, endDate, endTime } = customDate;

	// 	const filtered = data.filter(
	// 		({ uniqueName, sid, roomType, dateCompleted }) => {
	// 			return (
	// 				filterBySearchString(uniqueName, sid, search) &&
	// 				filterByRoomType(roomType, type) &&
	// 				filterByDateTimeRange(
	// 					dateCompleted,
	// 					range,
	// 					startDate,
	// 					startTime,
	// 					endDate,
	// 					endTime
	// 				)
	// 			);
	// 		}
	// 	);
	// 	setAreButtonsDisabled(true);
	// 	setFilteredTableData(filtered);
	// 	reset(undefined, {
	// 		keepValues: true,
	// 		keepTouched: false,
	// 		keepSubmitCount: true
	// 	});
	// 	if (callback)
	// 		callback();
	// };

	const handleClearAll = () => {
		reset(undefined, {
			keepTouched: false,
			keepSubmitCount: true
		});
		// setFilteredTableData(data);
		setAreButtonsDisabled(true);
	};

	return <Box
		paddingBottom="space70"
		as="form"
	>
		{/* onSubmit={handleSubmit(handleApplyFilters())} */}
		<Box display="flex" alignItems="flex-end" columnGap="space50">
			<Box>
				{/* <Label htmlFor={roomTypesId}>Room type</Label>
				<Select id={roomTypesId} {...register("type")}>
					{ROOM_TYPES.map((type) => (
						<Option value={type} key={type}>
							{type}
						</Option>
					))}
				</Select> */}
				<Label htmlFor="ttype">Status</Label>
				<Select id="ttype">
					<Option value="Successful" key="Successful">Successful</Option>
					<Option value="Failed" key="Failed">Failed</Option>
				</Select>
			</Box>
			<Box>
				<Label htmlFor={"drangeId"/* dateRangesId */}>Date/time range</Label>
				<Select
					id={"drangeId"/* dateRangesId */}
					{/* ...register("range") */...{}}
					insertAfter={
						// <DateTimePopover
						// 	onApply={(cb) => handleSubmit(handleApplyFilters(cb))}
						// 	register={register}
						// 	errors={[]}
						// />
						<></>
					}
				>
					{DATE_TIME_RANGES.map((range) => (
						<Option value={range.value} key={range.value}>
							{range.name}
						</Option>
					))}
				</Select>
			</Box>
			<Box display="flex" columnGap="space50" paddingLeft="space40">
				<Button
					variant="primary"
					aria-label="Apply filters"
					disabled={false/* areButtonsDisabled */}
					onClick={()=>{}/* handleSubmit(handleApplyFilters()) */}
					data-cy="custom-filter-group-apply-button"
				>
					<FilterIcon decorative />
					Apply
				</Button>
				<Button
					variant="link"
					disabled={
						// Object.keys(dirtyFields).length === 0 && areButtonsDisabled
						false
					}
					onClick={()=>{}/* handleClearAll */}
					data-cy="custom-filter-group-clear-button"
				>
					Clear all
				</Button>
			</Box>
		</Box>
		<Box paddingY="space50">
			<Separator orientation="horizontal" />
		</Box>
		<Box display="flex" justifyContent="space-between">
			<Box width="size40">
				{/* <Input
					aria-label="Search"
					type="text"
					placeholder="Search by SID or unique name"
					{...register("search")}
					insertAfter={
						<Button
							variant="link"
							onClick={handleSubmit(handleApplyFilters())}
							data-cy="custom-filter-group-search-button"
						>
							<SearchIcon decorative={false} title="Search" />
						</Button>
					}
				/> */}
			</Box>
			<Button variant="secondary">
				<ExportIcon decorative />
				Export CSV
			</Button>
		</Box>
		<Box paddingTop="space50">
			{ filteredTableData.length > 0 ? <TheDataGrid data={filteredTableData} showDateTime /> : <EmptyState handleClearAll={handleClearAll} /> }
		</Box>
		<Box display="flex" justifyContent="center" marginTop="space70">
			<Pagination pageForward={ pageForward } pageBackward={ pageBackward } fetching={ http.inFlight } pageKeys={ state.pageKeys } nextPageKey={ state.nextPageKey } />
		</Box>
	</Box>
}
