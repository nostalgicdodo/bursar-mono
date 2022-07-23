
/**
 |
 | On cliking an in-page link,
 | 	smooth-scroll to the section
 |
 | Limitation: This assumes that the link clicked does not have query parameters
 |
 */
$( document ).on( "click", "a[ href *= '#' ]", function ( event ) {
	let $link = $( event.target ).closest( "a" )
	let href = $link.get( 0 ).href
	let fullPathOfCurrentPage = window.location.origin + window.location.pathname + window.location.search

	// If the link is not an in-page link, do nothing and resume default behavior
	let sectionId = href.replace( fullPathOfCurrentPage, "" )
	if ( sectionId === href )
		return;

	event.preventDefault()

	window.__THIS.utils.smoothScrollTo( sectionId )

} );
