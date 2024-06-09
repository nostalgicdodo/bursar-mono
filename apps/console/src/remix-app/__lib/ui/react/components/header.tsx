
import * as React from "react"
import { Link } from "@remix-run/react"
import { Menu } from "@headlessui/react"
import { Bars3Icon } from "@heroicons/react/24/outline"





export default function Header ( { className = "" } ) {
	return <div className={ className }>
		<div className="relative flex justify-between items-center bg-purple-1/75 rounded-100 px-75 py-3 shadow-[0px_11px_16px_-5px] shadow-purple-1/60">
			<h1 className="h1">
				<span className="sr-only">bursar</span>
				<img src="/media/logos/color/logo-bursar-color.svg" alt="bursar logo" className="max-w-350" />
			</h1>
			<Menu>
				<Menu.Button className="ring-transparent outline-none">
					<Bars3Icon className="w-100 text-black" />
				</Menu.Button>
				<NavigationMenu className="absolute top-full right-0 mt-25 mr-25 border border-neutral-2 rounded-25 ring-transparent shadow-2 outline-none" />
			</Menu>
		</div>
	</div>
}

function NavigationMenu ( { className } ) {
	let menuItems = [
		[
			{ label: "Dashboard", href: "/dashboard" },
			{ label: "Transaction Log", href: "/log" },
		],
		[
			{ label: "Sign out", href: "/auth/logout" },
		],
	]

	return <Menu.Items className={ `bg-white w-max divide-y divide-neutral-2 ${ className }` }>
		{ menuItems.map( ( group, i ) => <div key={ i } className="py-25">
			{ group.map( ( item, i ) => <Menu.Item key={ i } as={ React.Fragment }>
				<Link to={ item.href } className="block px-75 py-25 p ui-not-active:text-neutral-6 ui-active:text-purple-2 ui-active:underline">{ item.label }</Link>
			</Menu.Item> ) }
		</div> ) }
	</Menu.Items>
}
