
import { ArrowSmallLeftIcon, ArrowSmallRightIcon } from "@heroicons/react/24/outline"

import noOp from "@/utilities/functions/no-op"
import CircularLoadingIndicator from "@/ui/react/components/loading-indictors/circular-loading-indicator"





export default function Pagination ( { current = 1, onNext = noOp, onPrev = noOp, lastPage = false, isFetching = false, className = "" } ) {
	return <div className={ `flex justify-center items-center space-x-150 text-black ${ current ? "" : "invisible" } ${ className }` }>
		<button type="button" className={ `${ ( isFetching || ( current <= 1 ) ) ? "pointer-events-none opacity-50" : "cursor-pointer" }` } disabled={ isFetching || ( current <= 1 ) }>
			<ArrowSmallLeftIcon className="w-125 p-25 border border-neutral-5 rounded-full" onClick={ onPrev } />
		</button>
		<div className="relative text-neutral-6">
			<span className={ isFetching ? "invisible" : "" }>{ current }</span>
			<CircularLoadingIndicator className={ `absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex w-75 ${ isFetching ? "" : "hidden" }` } />
		</div>
		<button type="button" className={ `${ ( isFetching || lastPage ) ? "pointer-events-none opacity-50" : "cursor-pointer" }` } disabled={ isFetching || lastPage }>
			<ArrowSmallRightIcon className="w-125 p-25 border border-neutral-5 rounded-full" onClick={ onNext } />
		</button>
	</div>
}
