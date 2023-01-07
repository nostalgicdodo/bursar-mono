
window.__THIS = window.__THIS || { };
window.__THIS.utils = window.__THIS.utils || { };



/**
 | Smooth scroll to a section
 |
 */
function smoothScrollTo ( locationHash ) {

	if ( ! locationHash )
		return;

	var locationId = locationHash.replace( "#", "" );
	var domLocation = document.getElementById( locationId );
	if ( ! domLocation )
		return;

	window.scrollTo( { top: domLocation.offsetTop, behavior: "smooth" } );

}
window.__THIS.utils.smoothScrollTo = smoothScrollTo;
