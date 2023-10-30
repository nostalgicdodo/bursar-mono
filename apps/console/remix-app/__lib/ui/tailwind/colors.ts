
/** @type {import('tailwindcss').Config} */

import { hexRGB } from "../../utils/colors"



function getRGBChannels ( hex ) {
	const { red, green, blue } = hexRGB( hex )
	return `${red}, ${green}, ${blue}`
}




let conf = {
	theme: null,
	themeExtensions: null,
	plugins: null,
	corePlugins: null,
}

conf.themeExtensions = {
	colors: {
		white: "rgba( var(--white) , <alpha-value> )",
		light: "rgba( var(--light) , <alpha-value> )",

		neutral: {
			"1": "rgba( var(--neutral-1) , <alpha-value> )",
			"2": "rgba( var(--neutral-2) , <alpha-value> )",
			"3": "rgba( var(--neutral-3) , <alpha-value> )",
			"4": "rgba( var(--neutral-4) , <alpha-value> )",
			"5": "rgba( var(--neutral-5) , <alpha-value> )",
			"6": "rgba( var(--neutral-6) , <alpha-value> )",
			"7": "rgba( var(--neutral-7) , <alpha-value> )",
		},

		dark: "rgba( var(--dark) , <alpha-value> )",
		black: "rgba( var(--black) , <alpha-value> )",

		cream: "rgba( var(--cream) , <alpha-value> )",
		red: "rgba( var(--red) , <alpha-value> )",
		purple: {
			"1": "rgba( var(--purple-1), <alpha-value> )",
			"2": "rgba( var(--purple-2), <alpha-value> )",
			"3": "rgba( var(--purple-3), <alpha-value> )",
		},
		indigo: {
			"1": "rgba( var(--indigo-1), <alpha-value> )",
			"2": "rgba( var(--indigo-2), <alpha-value> )",
			"3": "rgba( var(--indigo-3), <alpha-value> )",
		},
		blue: {
			"1": "rgba( var(--blue-1), <alpha-value> )",
			"2": "rgba( var(--blue-2), <alpha-value> )",
			"3": "rgba( var(--blue-3), <alpha-value> )",
		}

	},
}

conf.plugins = function ( plugin ) {
	return plugin( ( { theme, addBase, addComponents, addUtilities } ) => {
		addBase( {
			":root": {
				// Grayscale colors
				"--white": getRGBChannels( "#FFFFFF" ),
				"--light": getRGBChannels( "#FCFAFE" ),

				"--neutral-1": getRGBChannels( "#E1DFE3" ),
				"--neutral-2": getRGBChannels( "#C6C4C8" ),
				"--neutral-3": getRGBChannels( "#ABA9AD" ),
				"--neutral-4": getRGBChannels( "#8F8E92" ),
				"--neutral-5": getRGBChannels( "#747377" ),
				"--neutral-6": getRGBChannels( "#59585C" ),
				"--neutral-7": getRGBChannels( "#3E3D41" ),

				"--dark": getRGBChannels( "#222125" ),
				"--black": getRGBChannels( "#000000" ),

				// Brand colors
				"--purple-1": getRGBChannels( "#E2D6F8" ),
				"--purple-2": getRGBChannels( "#8A5CE5" ),
				"--purple-3": getRGBChannels( "#3C3055" ),
				"--indigo-1": getRGBChannels( "#BFB7F5" ),
				"--indigo-2": getRGBChannels( "#6C5CE7" ),
				"--indigo-3": getRGBChannels( "#423B7A" ),
				"--blue-1": getRGBChannels( "#C5CBFF" ),
				"--blue-2": getRGBChannels( "#7A88FF" ),
				"--blue-3": getRGBChannels( "#484E84" ),
			},
		} )
	} )
}





// module.exports = conf
export default conf
