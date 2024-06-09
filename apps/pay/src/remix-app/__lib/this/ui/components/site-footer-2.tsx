
import { BursarLogo } from "./bursar-logo"
import { ClientLogo } from "./client-logo"

export function SiteFooter2 ( { className = "" } ) {
	return <div className={ `flex justify-center items-center gap-x-75 ${ className }` }>
		<ClientLogo name="Greendale Community College logo" logoURL="/media/logos/test-greendale-community-college.png" className="w-250" />
		<span className="w-[1px] h-6 bg-neutral-3"></span>
		<BursarLogo className="w-500" />
	</div>
}
