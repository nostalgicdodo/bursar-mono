
/** @type {import('tailwindcss').Config} */





let conf = {
	theme: null,
	themeExtensions: null,
	plugins: null,
	corePlugins: null,
}

conf.themeExtensions = {
	fontSize: {
		h1: [ "var(--h1)", 1.125 ],
		h2: [ "var(--h2)", 1.125 ],
		h3: [ "var(--h3)", 1.125 ],
		h4: [ "var(--h4)", 1.125 ],
		h5: [ "var(--h5)", 1.125 ],
		h6: [ "var(--h6)", 1.125 ],
		p: [ "var(--p)", 1.375 ],
		label: [ "var(--label)", 1.375 ],
		small: [ "var(--small)", 1.375 ],
	},
	lineHeight: ( { theme } ) => ({
		"xs": 1,
		"sm": 1.125,
		"md": 1.375,
		"lg": 1.5,
		"xl": 1.625,
		"2xl": 2,
		...theme( "spacing" ),
	}),
	fontFamily: {
		sans: [ "Montserrat", "Arial", "sans-serif" ],
		serif: [ "Playfair Display", "Times", "serif" ],
	},
	fontWeight: {
		// strong: 700,
	},
}

conf.plugins = function ( plugin ) {
	return plugin( ( { theme, addBase, addComponents, addUtilities } ) => {
		const fontScale = 1.2

		addBase( {
			":root": {
				// "--font-scale": `${ fontScale },
				"--font-offset": "0.0375",
				"--h1-scale": `${ fontScale ** 7 }`,
				"--h2-scale": `${ fontScale ** 6 }`,
				"--h3-scale": `${ fontScale ** 5 }`,
				"--h4-scale": `${ fontScale ** 4 }`,
				"--h5-scale": `${ fontScale ** 3 }`,
				"--h6-scale": `${ fontScale ** 2 }`,
				"--p-scale": `${ fontScale }`,
				"--label-scale": `${ fontScale ** 0 }`,
				"--small-scale": `${ fontScale ** -1 }`,

				"--h1": "calc(var(--h1-scale) * var(--card) * var(--font-offset) )",
				"--h2": "calc(var(--h2-scale) * var(--card) * var(--font-offset) )",
				"--h3": "calc(var(--h3-scale) * var(--card) * var(--font-offset) )",
				"--h4": "calc(var(--h4-scale) * var(--card) * var(--font-offset) )",
				"--h5": "calc(var(--h5-scale) * var(--card) * var(--font-offset) )",
				"--h6": "calc(var(--h6-scale) * var(--card) * var(--font-offset) )",
				"--p": "calc(var(--p-scale) * var(--card) * var(--font-offset) )",
				"--label": "calc(var(--label-scale) * var(--card) * var(--font-offset) )",
				"--small": "calc(var(--small-scale) * var(--card) * var(--font-offset) )",
			},
		} )

		addComponents( {
		} )

		addUtilities( {
			".h1": { fontSize: "var(--h1)", lineHeight: 1.125 /* , margin: 0 */ },
			".h2": { fontSize: "var(--h2)", lineHeight: 1.125 /* , margin: 0 */ },
			".h3": { fontSize: "var(--h3)", lineHeight: 1.125 /* , margin: 0 */ },
			".h4": { fontSize: "var(--h4)", lineHeight: 1.125 /* , margin: 0 */ },
			".h5": { fontSize: "var(--h5)", lineHeight: 1.375 /* , margin: 0 */ },
			".h6": { fontSize: "var(--h6)", lineHeight: 1.375 /* , margin: 0 */ },
			".p": { fontSize: "var(--p)", lineHeight: 1.375 /* , margin: 0 */ },
			".label": { fontSize: "var(--label)", lineHeight: 1.375 },
			".small": { fontSize: "var(--small)", lineHeight: 1.375 },
			".em": { fontStyle: "italic" },
			// ".strong": { fontWeight: 700 },
			".text-decoration-none": { textDecoration: "none" },
		} )
	} )
}





// module.exports = conf
export default conf
