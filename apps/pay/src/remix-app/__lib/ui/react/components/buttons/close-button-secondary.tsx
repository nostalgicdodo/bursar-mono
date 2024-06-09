
import { Link } from "@remix-run/react"
import { XMarkIcon } from "@heroicons/react/24/outline"
import removeWordsFromString from "@/utilities/string/remove-words-from-string";

type ButtonProps = {
	as: string | typeof Link;
	size: "small" | "regular" | "large";
	padding: string;
	className: string;
	removeClasses: string | string[];
	children: React.ReactNode,
	// [ key: string ]: any,
}
export default function CloseButtonSecondary ( { as = "button", size = "regular", className = "", removeClasses = [ ], children, ...props }: Partial<ButtonProps> ) {
	let baseClasses = ""
	if ( as === "button" ) {
		props.type = props.type ?? "button"
	}
	else if ( as === Link || as === "a" ) {
		baseClasses = "inline-block"
	}

	const As = as

	// Compose the classname string
	const fullClassName = `${ baseClasses } ${ sizes[ size ] } rounded-25 bg-white shadow-1`
	const resolvedClassName = `${ removeWordsFromString( fullClassName, removeClasses ) } ${ className }`

	return <As className={ resolvedClassName } { ...props }>
		<XMarkIcon className="text-orange-2 font-bold" />
		{ children }
	</As>
}


const sizes = {
	small: "p-min [&>svg]:w-75",
	regular: "p-25 [&>svg]:w-75",
	large: "p-min [&>svg]:w-100",
}
