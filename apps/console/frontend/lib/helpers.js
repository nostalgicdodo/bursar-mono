
/* DISCLAIMER: this is an example, not meant to be used in production */

import { format, isBefore, isAfter, add } from "date-fns";

export const formatDate = (date) => format(date, "yyyy-MM-dd");
export const formatDateTime = (date) =>
format(date, "HH:mm:ss 'UTC' yyyy-MM-dd");

export const filterBySearchString = (
	uniqueName,
	sid,
	searchValue
) => {
	const lowerCaseName = uniqueName.toLocaleLowerCase();
	const lowerCaseSid = sid.toLocaleLowerCase();

	return (
		lowerCaseName.includes(searchValue) || lowerCaseSid.includes(searchValue)
	);
};

export const filterByRoomType = (
	roomType,
	filterValue
) => {
	if (filterValue === "All") return true;
	return roomType === filterValue;
};

export const filterByDateTimeRange = (
	dateCompleted,
	filterValue,
	startDate,
	startTime,
	endDate,
	endTime
) => {
	if (filterValue === "all")
		return true;
	if (filterValue !== "custom") {
		const rangeMap = {
			"12hours": { hours: -12 },
			day: { days: -1 },
			threeDays: { days: -3 }
		};
		const computedStart = add(new Date(), rangeMap[filterValue]);

		return isAfter(dateCompleted, computedStart);
	}

	const computedCustomStart = new Date(`${startDate}T${startTime}`);
	const computedCustomEnd = new Date(`${endDate}T${endTime}`);

	return (
		isAfter(dateCompleted, computedCustomStart) &&
		isBefore(dateCompleted, computedCustomEnd)
	);
};

export const isEndDateBeforeStartDate = (
	startDate,
	startTime,
	endDate,
	endTime
) => {
	const computedStart = new Date(`${startDate}T${startTime}`);
	const computedEnd = new Date(`${endDate}T${endTime}`);

	return isBefore(computedEnd, computedStart);
};
