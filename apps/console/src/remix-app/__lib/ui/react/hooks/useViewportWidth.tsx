
import viewportSizes from "@/ui/viewport-sizes"
import useViewportQuery from "./useViewportQuery"




type ViewportSizesReturnType =
	| [ "XL", 1480 ]
	| [ "LG", 1040 ]
	| [ "MD", 640 ]
	| [ "SM", 400 ]
	| [ "XS", 360 ]
	| [ "XXS", 0 ]

export default function useViewportWidth (): ViewportSizesReturnType {
	const greaterThanEqualToExtraSmall = useViewportQuery( ">= xs" )
	const greaterThanEqualToSmall = useViewportQuery( ">= sm" )
	const greaterThanEqualToMedium = useViewportQuery( ">= md" )
	const greaterThanEqualToLarge = useViewportQuery( ">= lg" )
	const greaterThanEqualToExtraLarge = useViewportQuery( ">= xl" )

	if ( greaterThanEqualToExtraLarge ) {
		return [ "XL", viewportSizes[ "xl" ] ]
	}
	if ( greaterThanEqualToLarge ) {
		return [ "LG", viewportSizes[ "lg" ] ]
	}
	if ( greaterThanEqualToMedium ) {
		return [ "MD", viewportSizes[ "md" ] ]
	}
	if ( greaterThanEqualToSmall ) {
		return [ "SM", viewportSizes[ "sm" ] ]
	}
	if ( greaterThanEqualToExtraSmall ) {
		return [ "XS", viewportSizes[ "xs" ] ]
	}
	else {
		return [ "XXS", 0 ]
	}
}
