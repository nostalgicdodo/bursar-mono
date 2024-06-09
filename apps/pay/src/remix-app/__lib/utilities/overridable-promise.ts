
/**
 |
 | Overridable Promise
 |
 | A promise that can be *explicitly* settled, manually, from the outside.
 |
 |
 | References:
 | - https://stackoverflow.com/questions/43327229/typescript-subclass-extend-of-promise-does-not-refer-to-a-promise-compatible-c
 | - Promise type
 | - PromiseLike type
 | - PromiseConstructor type
 | - ConstructorParameters generic type
 |
 |
 */

export default class OverridablePromise<T> extends Promise<T> {
	public resolve: Parameters<ConstructorParameters<typeof Promise<T>>[ 0 ]>[ 0 ]
	public reject: Parameters<ConstructorParameters<typeof Promise<T>>[ 0 ]>[ 1 ]

	constructor ( executor: ConstructorParameters<typeof Promise<T>>[ 0 ] ) {
		let _resolve!: Parameters<ConstructorParameters<typeof Promise<T>>[ 0 ]>[ 0 ]
		let _reject!: Parameters<ConstructorParameters<typeof Promise<T>>[ 0 ]>[ 1 ]

		super( ( resolve, reject ) => {
			_resolve = resolve
			_reject = reject
			executor( resolve, reject )
		} )

		this.resolve = _resolve
		this.reject = _reject
	}
}
