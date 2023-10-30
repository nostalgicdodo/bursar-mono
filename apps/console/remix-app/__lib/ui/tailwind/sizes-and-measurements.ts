
/** @type {import('tailwindcss').Config} */

import { viewportSizesInPixels } from "../viewport-sizes"








let conf = {
	theme: null,
	themeExtensions: null,
	plugins: null,
	corePlugins: null,
}

conf.theme = {
	screens: viewportSizesInPixels
}





export default conf
