
import type { ComponentType } from "react";

import { Link } from "@remix-run/react"

import { sizes, textCases } from "./props-to-styles"
import { isAString } from "@/utilities/type-checking/strings/identity";
import CircularLoadingIndicator from "@/ui/react/components/loading-indictors/circular-loading-indicator"
import removeWordsFromString from "@/utilities/string/remove-words-from-string";





type ButtonProps = {
	// as: string | typeof Link;
	as: ComponentType | keyof JSX.IntrinsicElements;
	size: "xs" | "small" | "regular" | "large";
	case: "normal" | "upper" | "lower";
	submitting?: boolean;
		// ^ if the button is part of a form,
		// 	then this attribute can be set to `true`
		// 	when the form is submitting and
		// 	a loading indicator will overlay the button
	className: string;
	removeClasses: string | string[];
	children: React.ReactNode,
	// [ key: string ]: any,
}
export default function ButtonGray ( { size = "regular", as = "button", className = "", removeClasses = [ ], submitting = false, children, ...props }: Partial<ButtonProps> ) {
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

	const submittingClassName = submitting ? "*:invisible" : ""
	const fullClassName = `relative ${ baseClasses } rounded-25 bg-neutral-6 font-medium text-white outline-none shadow-1 text-center ${ sizes[ size ] } ${ textCases[ textCase ] } ${ submittingClassName }`
	const resolvedClassName = `${ removeWordsFromString( fullClassName, removeClasses ) } ${ className }`


	// const submittingClassName = submitting ? "*:invisible" : ""

	// return <As className={ `relative ${ baseClasses } rounded-25 bg-white font-medium text-neutral-6 outline-none shadow-1 text-center ${ sizes[ size ] } ${ textCases[ textCase ] } ${ submittingClassName } ${ className }` } { ...props }>
	return <As className={ resolvedClassName } { ...props }>
		{ isAString( children ) ? <span>{ children }</span> : children }
		{/*
			^ If the children is just a string,
				then the `*:invisible` class will not have any effect.
				Hence, it is wrapped in a `span` tag.
		*/}
		{ submitting && <CircularLoadingIndicator
			className="absolute inset-0 flex mx-auto items-center w-75 text-neutral-3"
			style={{ visibility: submitting ? "visible" : undefined }}
		/> }
	</As>
}
