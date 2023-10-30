
export default function CircularLoadingIndicator ( { className = "w-100 text-purple-2", ...props }: React.ComponentProps<"span"> ) {
	return <span className={ `circular-loading-indicator-container ${ className }` } { ...props }>
		<span></span>
	</span>
}
