
export function BursarLogo ( { alt = "bursar logo", className = "" }: Omit<React.ComponentProps<"img">, "src"> ) {
	return <img
		src="/media/logos/bursar-powered-by.svg"
		alt={ alt }
		className={ className }
	/>
}
