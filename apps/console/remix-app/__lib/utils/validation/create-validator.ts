
import { ObjectType } from "../typescript-types/common-types"

export type ValidationErrorType = "_" | "EMPTY" | "SHORT" | "LONG" | "INVALID" | "TAKEN" | "MISMATCH" | (string & { })
	// ^ the "_" is when there is an issue, but it's not specified, i.e. generic

type ValidatorOptions = {
	shortCircuit?: boolean;
	// message?: string;
}

export function createValidator ( errorType: ValidationErrorType, validatorFn: ( this: ObjectType, v: any ) => boolean | Promise<boolean>, options: ValidatorOptions = { } ) {
	const shortCircuit = typeof options.shortCircuit === "boolean" ? options.shortCircuit : true
	return {
		errorType,
		fails: validatorFn,
		...options,
			// ^ flattening the whole thing so that it's easier for downstream consumers to well, consume this
		shortCircuit,
			// ^ even though its included in the `options` object, we need to ensure that it has a default value
	}
}
