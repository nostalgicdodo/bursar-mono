
import { useFormContext } from "@/ui/react/context-providers/form-old"

type ValidationErrorProps = {
	issues: string[];
	messages: Record<string, React.ReactNode>;
	className?: string;
	// isEmpty: string;
	// isShort: string;
	// isLong: string;
	// isInvalid: string;
	// isTaken: string;
}
const defaultValidationMessages = {
	_: "There is an issue",
		// Generic issue, typically to be overriden by the consumer of this component
	EMPTY: "This cannot be empty.",
	SHORT: "This is too short.",
	LONG: "This is too long.",
	INVALID: "This is invalid.",
	TAKEN: "This has been taken.",
} as const;

export default function ValidationErrorMessages ( { className = "", ...props }: Partial<ValidationErrorProps> ) {
	const { isSubmitting } = useFormContext()
	const issues = props.issues
	const messages = props.messages ?? { }

	if ( isSubmitting ) {
		return null
	}
	if ( !Array.isArray( issues ) || issues.length === 0 ) {
		return null
	}

	return <>
		{ issues.map( ( type: string, i ) => <p className={ `label text-red-3 ${ className }` } key={ i }>
			{
				messages[ type ]
				?? defaultValidationMessages[ type ]
			}
		</p> ) }
	</>
}
