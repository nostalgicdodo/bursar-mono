
import pixelToViewportHeightUnits from "@/utilities/css"
import useRegionDimensions from "@/ui/react/hooks/useRegionDimensions"

export default function TrackLayoutRegions () {
	const regionDimensions = useRegionDimensions()

	setValuesOnDocumentRoot( regionDimensions )

	return null
}


function setValuesOnDocumentRoot ( dimensions ) {
	document.documentElement.style.setProperty( "--top-region-height", String( pixelToViewportHeightUnits( dimensions.top.height ) ) )
	document.documentElement.style.setProperty( "--main-region-min-height", String( pixelToViewportHeightUnits( dimensions.main.height ) ) )
}
