
import { ArrowSmallLeftIcon, ArrowSmallRightIcon } from "@heroicons/react/24/outline"

import noOp from "@/utilities/functions/no-op"





export default function Pagination ( { current = 1, onNext = noOp, onPrev = noOp, lastPage = false, className = "" } ) {
	return <div className={ `flex justify-center items-center space-x-150 text-black ${ current ? "" : "invisible" } ${ className }` }>
		<button type="button" className={ `${ current <= 1 ? "pointer-events-none" : "cursor-pointer" }` } disabled={ current <= 1 }>
			<ArrowSmallLeftIcon className="w-125 p-25 border border-neutral-5 rounded-full" onClick={ onPrev } />
		</button>
		<span className="text-neutral-6">{ current }</span>
		<button type="button" className={ `${ lastPage ? "pointer-events-none" : "cursor-pointer" }` } disabled={ lastPage }>
			<ArrowSmallRightIcon className="w-125 p-25 border border-neutral-5 rounded-full" onClick={ onNext } />
		</button>
	</div>
}
