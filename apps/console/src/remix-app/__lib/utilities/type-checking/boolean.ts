
export function isABoolean ( value: unknown ): value is boolean {
	return typeof value === "boolean"
}
	export function isNotABoolean ( value: unknown ) {
		return typeof value !== "boolean"
	}
