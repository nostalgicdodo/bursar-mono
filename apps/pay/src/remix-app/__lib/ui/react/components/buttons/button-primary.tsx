
import type { ComponentType } from "react"

import React from "react"
import { Link } from "@remix-run/react"

import { sizes, textCases } from "./props-to-styles"
import removeWordsFromString from "@/utilities/string/remove-words-from-string"
import CircularLoadingIndicator from "@/ui/react/components/loading-indictors/circular-loading-indicator"
import { isAString } from "@/utilities/type-checking/strings/identity"





type ButtonProps<C extends ComponentType | keyof JSX.IntrinsicElements> = React.ComponentPropsWithoutRef<C> & Partial<{
	// as: string | typeof Link;
	as: C;
	size: "xs" | "small" | "regular" | "large";
	case: "normal" | "upper" | "lower";
	className: string;
	removeClasses: string | string[];
	submitting?: boolean;
		// ^ if the button is part of a form,
		// 	then this attribute can be set to `true`
		// 	when the form is submitting and
		// 	a loading indicator will overlay the button
	children: React.ReactNode,
	// [ key: string ]: any,
}>
export default function ButtonPrimary<C extends ComponentType | keyof JSX.IntrinsicElements> ( { size = "regular", as = "button", className = "", removeClasses = [ ], submitting = false, children, ...props }: ButtonProps<C> ) {
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
	const submittingClassName = submitting ? "*:invisible" : ""
	const fullClassName = `relative ${ baseClasses } rounded-25 bg-purple-2 font-bold text-white text-center outline-none button-shadow disabled:opacity-80 disabled:cursor-not-allowed ${ sizes[ size ] } ${ textCases[ textCase ] } ${ submittingClassName }`
	const resolvedClassName = `${ removeWordsFromString( fullClassName, removeClasses ) } ${ className }`


	return <As className={ resolvedClassName } { ...props }>
		{ isAString( children ) ? <span>{ children }</span> : children }
		{/*
			^ If the children is just a string,
				then the `*:invisible` class will not have any effect.
				Hence, it is wrapped in a `span` tag.
		*/}
		{ submitting && <CircularLoadingIndicator
			className="absolute inset-0 flex mx-auto items-center w-75 text-light"
			style={{ visibility: submitting ? "visible" : undefined }}
		/> }
	</As>
}
