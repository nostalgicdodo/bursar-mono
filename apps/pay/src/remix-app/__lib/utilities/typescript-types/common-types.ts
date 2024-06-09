
export type Simplify<T> = {
	[K in keyof T]: T[ K ]
} & {}

// export type Falsy = null | undefined | 0 | -0 | 0n | NaN | "" | false | document.all
export type Falsy = null | undefined | 0 | -0 | 0n | "" | false

export type FunctionType = ( ...args: any ) => any
// reference: https://totaltypescript.com/dont-use-function-keyword-in-typescript

export type ObjectType = Record<PropertyKey, any>

export interface RecursiveUnknownObjectType {
	[ key: PropertyKey ]: unknown | RecursiveUnknownObjectType
}

export type Nullable<T> = T | null | undefined

export type NonEmpty<T> = Exclude<T, null | undefined | void>

export type InvertRecord<T extends Record<PropertyKey, PropertyKey>> = {
	[ K in keyof T as T[ K ] ]: K
}

// export type OptionalEvenIfNotExists<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>
export type Optional<T, K> = K extends keyof T
					? Partial<Pick<T, K>> & Omit<T, K>
					: T

export type MapOverUnionAndMakeOptional<T, K> = T extends {} ? Optional<T, K> : T;

export type RequireAtLeastOne<T> = {
	[ K in keyof T ]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[ keyof T ]

export type CapitalizeFirstLetter<T> = T extends `${ infer F }${ infer R }` ? `${ Uppercase<F> }${ R }` : never
