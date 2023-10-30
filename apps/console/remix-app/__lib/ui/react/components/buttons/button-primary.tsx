
import type { ComponentType } from "react";

import React from "react";
import { Link } from "@remix-run/react"

import { sizes, textCases } from "./props-to-styles"

type ButtonProps<C extends ComponentType | keyof JSX.IntrinsicElements> = React.ComponentPropsWithoutRef<C> & Partial<{
	// as: string | typeof Link;
	as: C;
	size: "small" | "regular" | "large";
	case: "normal" | "upper" | "lower";
	className: string;
	children: React.ReactNode,
	// [ key: string ]: any,
}>
export default function ButtonPrimary<C extends ComponentType | keyof JSX.IntrinsicElements> ( { size = "regular", as = "button", className = "", children, ...props }: ButtonProps<C> ) {
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
	// else if ( as === Link || as === "a" ) {
	// 	baseClasses = "inline-block"
	// }
	// else if ( as === "input" ) {
	// 	props.type = props.type ?? "text"
	// }



	return <As className={`relative ${ baseClasses } px-75 rounded-25 bg-purple-2 font-bold text-white text-center outline-none button-shadow disabled:opacity-80 disabled:cursor-not-allowed ${ sizes[ size ] } ${ textCases[ textCase ] } ${ className }`} { ...props }>
		{ children }
	</As>
}
