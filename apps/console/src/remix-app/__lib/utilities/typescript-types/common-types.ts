
export type Simplify<T> = {
	[K in keyof T]: T[ K ]
} & {}

export type FunctionType = ( ...args: any ) => unknown

export type ObjectType = Record<PropertyKey, any>

export type InvertRecord<T extends Record<PropertyKey, PropertyKey>> = {
	[ K in keyof T as T[ K ] ]: K
}

export type Optional<T, K extends keyof T> = Simplify<Partial<Pick<T, K>> & Omit<T, K>>
