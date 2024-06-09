
type ClientLogoProps =
	Omit<React.ComponentProps<"img">, "src">
	& {
		name: string;
		logoURL: string;
	}

export function ClientLogo ( { name, logoURL, alt = "bursar logo", className = "" }: ClientLogoProps ) {
	return <img
		src={ logoURL }
		alt={ name || alt }
		className={ className }
	/>
}
