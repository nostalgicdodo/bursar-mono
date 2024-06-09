
/** @type {import('tailwindcss').Config} */

// const viewportSizes = require( "../viewport-sizes" )
import { viewportSizesInPixels } from "../viewport-sizes"



// const viewportSizesInPixels = Object.fromEntries( Object.entries( viewportSizes ).map( function ( e ) {
// 	e[ 1 ] = `${ e[ 1 ] }px`;
// 	return e
// } ) )





let conf = {
	theme: null,
	themeExtensions: null,
	plugins: null,
	corePlugins: null,
}

conf.theme = { }

conf.themeExtensions = {
	spacing: {
		"min": "var(--space-min)",
		25: "var(--space-25)",
		50: "var(--space-50)",
		75: "var(--space-75)",
		100: "var(--space-100)",
		125: "var(--space-125)",
		150: "var(--space-150)",
		175: "var(--space-175)",
		200: "var(--space-200)",
		225: "var(--space-225)",
		250: "var(--space-250)",
		275: "var(--space-275)",
		300: "var(--space-300)",
		325: "var(--space-325)",
		350: "var(--space-350)",
		375: "var(--space-375)",
		400: "var(--space-400)",
		425: "var(--space-425)",
		450: "var(--space-450)",
		475: "var(--space-475)",
		500: "var(--space-500)",
		525: "var(--space-525)",
		550: "var(--space-550)",
		575: "var(--space-575)",
		600: "var(--space-600)",
		625: "var(--space-625)",
		650: "var(--space-650)",
		675: "var(--space-675)",
		700: "var(--space-700)",
		725: "var(--space-725)",
		750: "var(--space-750)",
		775: "var(--space-775)",
		800: "var(--space-800)",
		825: "var(--space-825)",
		850: "var(--space-850)",
		875: "var(--space-875)",
		900: "var(--space-900)",
		925: "var(--space-925)",
		950: "var(--space-950)",
		975: "var(--space-975)",
		1000: "var(--space-1000)",
	},
	minWidth: ( { theme } ) => ({
		...theme( "spacing" )
	}),
	minHeight: ( { theme } ) => ({
		...theme( "spacing" )
	}),
	maxWidth: ( { theme } ) => ({
		...theme( "spacing" )
	}),
	maxHeight: ( { theme } ) => ({
		...theme( "spacing" )
	}),
	borderRadius: {
		25: "var(--space-25)",
		50: "var(--space-50)",
		75: "var(--space-75)",
		100: "var(--space-100)",
	},
	boxShadow: ( { theme } ) => ({
		1: `0 1px 4px 0 ${theme( "colors.black / 15%" )}`,
		2: `0 1px 6px 0 ${theme( "colors.black / 15%" )}, 0 0 1px 1px ${theme( "colors.black / 5%" )}`,

		// 3: `0 2px 4px 0 ${theme( "colors.black / 30%" )}, inset 0 -2px 2px 0 ${theme( "colors.black / 30%" )}, inset 0 -2px 2px 0 ${theme( "colors.white / 30%" )}`,
		// 4: `0 1px 6px 1px ${theme( "colors.black / 30%" )}`,
		// 5: `inset 0 1px 6px 1px ${theme( "colors.black / 30%" )}`,

		// 6: `inset 0 0 1px 1px ${theme( "colors.black / 15%" )}`,
		// 7: `inset 0 0 1px 1px ${theme( "colors.black / 10%" )}, inset 0 0 6px 1px ${theme( "colors.black / 20%" )}`,
	}),
}

conf.plugins = function ( plugin ) {
	return plugin( ( { theme, addBase, addComponents, addUtilities } ) => {
		addBase( {
			":root": {
				"--container-width": "300px",
				"--card": "var(--container-width)",

				"--space-100": "calc(var(--card)/12)",
				"--space-min": "calc(var(--space-100) * 0.125)",
				"--space-25": "calc(var(--space-100) * 0.25)",
				"--space-50": "calc(var(--space-100) * 0.5)",
				"--space-75": "calc(var(--space-100) * 0.75)",
				"--space-125": "calc(var(--space-100) * 1.25)",
				"--space-150": "calc(var(--space-100) * 1.5)",
				"--space-175": "calc(var(--space-100) * 1.75)",
				"--space-200": "calc(var(--space-100) * 2)",
				"--space-225": "calc(var(--space-100) * 2.25)",
				"--space-250": "calc(var(--space-100) * 2.5)",
				"--space-275": "calc(var(--space-100) * 2.75)",
				"--space-300": "calc(var(--space-100) * 3)",
				"--space-325": "calc(var(--space-100) * 3.25)",
				"--space-350": "calc(var(--space-100) * 3.5)",
				"--space-375": "calc(var(--space-100) * 3.75)",
				"--space-400": "calc(var(--space-100) * 4)",
				"--space-425": "calc(var(--space-100) * 4.25)",
				"--space-450": "calc(var(--space-100) * 4.5)",
				"--space-475": "calc(var(--space-100) * 4.75)",
				"--space-500": "calc(var(--space-100) * 5)",
				"--space-525": "calc(var(--space-100) * 5.25)",
				"--space-550": "calc(var(--space-100) * 5.5)",
				"--space-575": "calc(var(--space-100) * 5.75)",
				"--space-600": "calc(var(--space-100) * 6)",
				"--space-625": "calc(var(--space-100) * 6.25)",
				"--space-650": "calc(var(--space-100) * 6.5)",
				"--space-675": "calc(var(--space-100) * 6.75)",
				"--space-700": "calc(var(--space-100) * 7)",
				"--space-725": "calc(var(--space-100) * 7.25)",
				"--space-750": "calc(var(--space-100) * 7.5)",
				"--space-775": "calc(var(--space-100) * 7.75)",
				"--space-800": "calc(var(--space-100) * 8)",
				"--space-825": "calc(var(--space-100) * 8.25)",
				"--space-850": "calc(var(--space-100) * 8.5)",
				"--space-875": "calc(var(--space-100) * 8.75)",
				"--space-900": "calc(var(--space-100) * 9)",
				"--space-925": "calc(var(--space-100) * 9.25)",
				"--space-950": "calc(var(--space-100) * 9.5)",
				"--space-975": "calc(var(--space-100) * 9.75)",
				"--space-1000": "calc(var(--space-100) * 10)",
			},
			[`@media ( min-width: ${viewportSizesInPixels.xs} )`]: {
				":root": {
					"--container-width": "340px",
				}
			},
			[`@media ( min-width: ${viewportSizesInPixels.sm} )`]: {
				":root": {
					"--container-width": "380px",
				}
			},
			[`@media ( min-width: ${viewportSizesInPixels.md} )`]: {
				":root": {
					"--container-width": "600px",
					"--card": "calc(var(--container-width)/2)",
				}
			},
			[`@media ( min-width: ${viewportSizesInPixels.lg} )`]: {
				":root": {
					"--container-width": "1000px",
					"--card": "calc(var(--container-width)/3)",
				}
			},
			[`@media ( min-width: ${viewportSizesInPixels.xl} )`]: {
				":root": {
					"--container-width": "1440px",
				}
			},
		} )

		addComponents( {
			// Float-based grid system
			".container": {
				// boxSizing: "border-box",
				position: "relative",
				width: "100%",
				// maxWidth: "var(--container-width)",
				maxWidth: "300px",
				margin: "0 auto",
				padding: 0,
				"&.fluid": {
					maxWidth: "100%",
				},
				"&:after": {
					content: "\"\"",
					display: "table",
					clear: "both",
				},
				[`@media ( min-width: ${viewportSizesInPixels.xs} )`]: {
					maxWidth: "340px",
				},
				[`@media ( min-width: ${viewportSizesInPixels.sm} )`]: {
					maxWidth: "380px",
				},
				[`@media ( min-width: ${viewportSizesInPixels.md} )`]: {
					maxWidth: "600px",
				},
				[`@media ( min-width: ${viewportSizesInPixels.lg} )`]: {
					maxWidth: "1000px",
				},
				[`@media ( min-width: ${viewportSizesInPixels.xl} )`]: {
					maxWidth: "1440px",
				},
			},
			".row": {
				fontSize: 0,
				"&:after": {
					content: "\"\"",
					display: "table",
					clear: "both",
				},
			},
			".column": {
				// boxSizing: "border-box",
				display: "inline-block",
				verticalAlign: "top",
				width: "100%",
				// fontSize: "1.5rem",
			},
			".c-0": { width: "0%" },
			".c-1": { width: "8.33333%" },
			".c-2": { width: "16.66667%" },
			".c-3": { width: "25%" },
			".c-4": { width: "33.33333%" },
			".c-5": { width: "41.66667%" },
			".c-6": { width: "50%" },
			".c-7": { width: "58.33333%" },
			".c-8": { width: "66.66667%" },
			".c-9": { width: "75%" },
			".c-10": { width: "83.33333%" },
			".c-11": { width: "91.66667%" },
			".c-12": { width: "100%" },

			".c-offset-0": { marginLeft: "0%" },
			".c-offset-1": { marginLeft: "8.33333%" },
			".c-offset-2": { marginLeft: "16.66667%" },
			".c-offset-3": { marginLeft: "25%" },
			".c-offset-4": { marginLeft: "33.33333%" },
			".c-offset-5": { marginLeft: "41.66667%" },
			".c-offset-6": { marginLeft: "50%" },
			".c-offset-7": { marginLeft: "58.33333%" },
			".c-offset-8": { marginLeft: "66.66667%" },
			".c-offset-9": { marginLeft: "75%" },
			".c-offset-10": { marginLeft: "83.33333%" },
			".c-offset-11": { marginLeft: "91.66667%" },
		} )

		addUtilities( {
			".ltr": { direction: "ltr" },
			".rtl": { direction: "rtl" },
		} )
	} )
}

conf.corePlugins = {
	columns: false
}





// module.exports = conf
export default conf
