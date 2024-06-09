
import type { ComponentType } from "react"

import { Link } from "@remix-run/react"

import { sizes, textCases } from "./props-to-styles"

type ButtonProps = {
	// as: string | typeof Link;
	as: ComponentType | keyof JSX.IntrinsicElements;
	size: "regular" | "large";
	case: "normal" | "upper" | "lower";
	className: string;
	children: React.ReactNode,
	// [ key: string ]: any,
}
export default function ButtonLess ( { size = "regular", as = "button", className = "", children, ...props }: Partial<ButtonProps> ) {
	const As = as

	let baseClasses = ""
	if ( as === "button" ) {
		props.type = props.type ?? "button"
	}
	else {
		baseClasses = "inline-flex justify-center items-center cursor-pointer"
	}



	return <As className={`${ baseClasses } px-75 font-bold uppercase text-purple-2 text-center outline-none ${ sizes[ size ] } ${ textCases[ props.case ] } ${ className }`} { ...props }>
		{ children }
	</As>
}
