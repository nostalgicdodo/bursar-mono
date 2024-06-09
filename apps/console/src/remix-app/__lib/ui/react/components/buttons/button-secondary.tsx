
import type { ComponentType } from "react";

import { Link } from "@remix-run/react"

import { sizes, textCases } from "./props-to-styles"

type ButtonProps = {
	// as: string | typeof Link;
	as: ComponentType | keyof JSX.IntrinsicElements;
	size: "small" | "regular" | "large";
	case: "normal" | "upper" | "lower";
	className: string;
	children: React.ReactNode,
	// [ key: string ]: any,
}
export default function ButtonSecondary ( { size = "regular", as = "button", className = "", children, ...props }: Partial<ButtonProps> ) {
	const As = as

	let baseClasses = ""
	if ( as === "button" ) {
		props.type = props.type ?? "button"
	}
	else {
		baseClasses = "inline-flex justify-center items-center cursor-pointer"
	}

	return <As className={`relative ${ baseClasses } px-75 rounded-25 font-bold uppercase text-black text-center outline-none button-shadow ${ sizes[ size ] } ${ textCases[ props.case ] } ${ className }`} { ...props }>
		{ children }
	</As>
}
