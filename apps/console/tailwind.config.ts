
import type { Config } from "tailwindcss"

import plugin from "tailwindcss/plugin"
// import tailwindForms from "@tailwindcss/forms"
// import headlessUI from "@headlessui/tailwindcss"

import sizeAndMeasurements from "./src/remix-app/__lib/ui/tailwind/sizes-and-measurements"
import layoutSpacingAndShapes from "./src/remix-app/__lib/ui/tailwind/layout-spacing-and-shapes"
import colors from "./src/remix-app/__lib/ui/tailwind/colors"
import typography from "./src/remix-app/__lib/ui/tailwind/typography"
import components from "./src/remix-app/__lib/ui/tailwind/components"
// Overrides
import reactDayPicker from "./src/remix-app/__lib/ui/tailwind/overrides/react-day-picker"





const configurations = [
	sizeAndMeasurements,
	layoutSpacingAndShapes,
	colors,
	typography,
	components,

	// Overrides
	reactDayPicker,
]

const themeConfig = configurations.reduce( function ( acc, conf ) {
	return { ...acc, ...( conf.theme ?? { } ) }
}, { } )
const themeExtensionsConfig = configurations.reduce( function ( acc, conf ) {
	return { ...acc, ...( conf.themeExtensions ?? { } ) }
}, { } )
const corePluginsConfig = configurations.reduce( function ( acc, conf ) {
	return { ...acc, ...( conf.corePlugins ?? { } ) }
}, { } )


export default {
	content: [ "./src/remix-app/**/*.{js,jsx,ts,tsx}" ],
	theme: {
		...themeConfig,
		extend: themeExtensionsConfig,
	},
	darkMode: "class",
	corePlugins: corePluginsConfig,
	plugins: [
		// tailwindForms,
		// headlessUI,
		...(
			configurations
				.filter( c => c.plugins )
				.map( c => c.plugins( plugin, {
					theme: {
						...themeConfig,
						extend: themeExtensionsConfig,
					},
				} ) )
		),
	],
} satisfies Config
