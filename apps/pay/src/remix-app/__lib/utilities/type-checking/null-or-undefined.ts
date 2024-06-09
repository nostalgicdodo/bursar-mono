
const nullValue = null
const undefinedValue = void 0

/*
 |
 | Reference: https://developer.mozilla.org/en-US/docs/Glossary/Nullish
 |
 */
export function isNullish ( value: unknown ): value is null | undefined {
	return value === nullValue || value === undefinedValue
}
	export function isNotNullish<T> ( value: T ): value is NonNullable<T> {
		return value !== nullValue && value !== undefinedValue
	}

export function isNull ( value: unknown ): value is null {
	return value === nullValue
}
	export function isNotNull<T> ( value: T ): value is Exclude<T, null> {
		return value !== nullValue
	}

export function isUndefined ( value: unknown ): value is undefined {
	return value === undefinedValue
}
	export function isNotUndefined<T> ( value: T ): value is Exclude<T, undefined> {
		return value !== undefinedValue
	}
