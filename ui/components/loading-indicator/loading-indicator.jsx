
import { colors } from "@ui/design-system/theme"

export function LoadingIndicator () {
	return <div className="loading-spinner">
		<svg width="50" height="50" viewBox="0 0 44 44" role="status">
			<circle cx="22" cy="22" r="20" fill="none" stroke={colors.purple2} strokeWidth="4"></circle>
		</svg>
	</div>
}
