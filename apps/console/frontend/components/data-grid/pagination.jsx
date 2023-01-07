
import { Box } from "@twilio-paste/core/box"
import { Spinner } from "@twilio-paste/core/spinner"
import { Toaster } from "@twilio-paste/core/toast"
import { useToaster } from "~/components/twilio-paste-overrides"
import {
	Pagination as TwilioPagination,
	PaginationItems,
	PaginationArrow,
	PaginationLabel,
} from "@twilio-paste/core/pagination"

export function Pagination ( { pageForward, pageBackward, fetching, pageKeys, isLastPage } ) {
	const toaster = useToaster()

	const currentPageNumber = pageKeys.length + 1
	const onPageForward = ( e ) => {
		e.preventDefault();
		if ( fetching )
			return;
		if ( isLastPage )
			return toaster.push( { id: "pagination", message: "You're on the last page.", dismissAfter: 2000 } );
		pageForward()
	}
	const onPageBackward = ( e ) => {
		e.preventDefault();
		if ( fetching )
			return;
		if ( currentPageNumber <= 1 )
			return toaster.push( { id: "pagination", message: "You cannot go back any further.", dismissAfter: 2000 } );
		pageBackward()
	}

	return <>
		<TwilioPagination label="paged pagination navigation">
			<PaginationItems>
				<PaginationArrow variant="back" label="Go to previous page" onClick={onPageBackward} />
				<Box minWidth="sizeIcon30">
					{ !fetching && <>
						<PaginationLabel>
							{ currentPageNumber }
						</PaginationLabel>
					</> }
					{ fetching && <>
						<Spinner title="Loading" size="sizeIcon30" color="colorBackgroundPrimary" decorative={false} />
					</> }
				</Box>
				<PaginationArrow variant="forward" label="Go to next page" onClick={onPageForward} />
			</PaginationItems>
		</TwilioPagination>
		<Toaster {...toaster} />
	</>
}
