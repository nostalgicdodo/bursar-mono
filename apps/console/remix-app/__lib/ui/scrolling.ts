
type smoothScrollToOptions = {
	relativeTo?: string;
	offset?: number;
}
export function smoothScrollTo ( locationHash: string, options?: smoothScrollToOptions = { } ) {
	const { relativeTo, offset } = options

	if ( ! locationHash ) {
		return
	}

	var locationId = locationHash.replace( "#", "" )
	var domLocation = document.getElementById( locationId )
	if ( ! domLocation ) {
		return
	}

	const scrollContainerDOM = relativeTo ? document.getElementById( relativeTo ) : window
	if ( ! scrollContainerDOM ) {
		return
	}

	scrollContainerDOM.scrollTo( { top: domLocation.offsetTop, behavior: "smooth" } )
}
