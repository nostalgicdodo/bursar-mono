
/** @type {import('tailwindcss').Config} */





let conf = {
	theme: null,
	themeExtensions: null,
	plugins: null,
	corePlugins: null,
}

conf.plugins = function ( plugin, baseConfig = { } ) {
	return plugin( ( { theme, addBase, addComponents, addUtilities } ) => {
		addComponents( {
			".rdp": {
				"--rdp-accent-color": `${ theme( "colors.purple.2" ).replace( "<alpha-value>", "1" ) } !important`,
				"--rdp-background-color": `${ theme( "colors.light" ).replace( "<alpha-value>", "1" ) } !important`,
				"--rdp-accent-color-dark": `${ theme( "colors.purple.3" ).replace( "<alpha-value>", "1" ) } !important`,
				"--rdp-background-color-dark": `${ theme( "colors.neutral.1" ).replace( "<alpha-value>", "1" ) } !important`,
			},
		} )
	}, baseConfig )
}





export default conf
