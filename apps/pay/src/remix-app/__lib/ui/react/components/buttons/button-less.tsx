
import type { ComponentType } from "react"

import { Link } from "@remix-run/react"

import { sizes, textCases } from "./props-to-styles"
import removeWordsFromString from "@/utilities/string/remove-words-from-string";

type ButtonProps = {
	// as: string | typeof Link;
	as: ComponentType | keyof JSX.IntrinsicElements;
	size: "xs" | "small" | "regular" | "large";
	case: "normal" | "upper" | "lower";
	className: string;
	removeClasses: string | string[];
	children: React.ReactNode,
	// [ key: string ]: any,
}
export default function ButtonLess ( { size = "regular", as = "button", className = "", removeClasses = [ ], children, ...props }: Partial<ButtonProps> ) {
	const textCase = props.case
	delete props.case

	const As = as

	let baseClasses = ""
	if ( as === "button" ) {
		props.type = props.type ?? "button"
	}
	else {
		baseClasses = "inline-flex justify-center items-center cursor-pointer"
	}

	// const submittingClassName = submitting ? "*:invisible" : ""
	const fullClassName = `relative ${ baseClasses } font-bold text-purple-2 outline-none text-center ${ sizes[ size ] } ${ textCases[ textCase ] }`
	const resolvedClassName = `${ removeWordsFromString( fullClassName, removeClasses ) } ${ className }`


	// return <As className={`${ baseClasses } px-25 font-medium outline-none text-center ${ sizes[ size ] } ${ textCases[ textCase ] } ${ className }`} { ...props }>
	return <As className={ resolvedClassName } { ...props }>
		{ children }
	</As>
}
