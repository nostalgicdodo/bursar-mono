
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
			".hr": {
				height: "2px",
				border: 0,
				margin: 0,
			},

			".button": {
				height: "var(--space-150)",
				padding: "0 var(--space-50)",
				fontSize: "var(--label)",
				fontWeight: 700,
				lineHeight: "var(--space-150)",
				// textTransform: "uppercase",
				color: theme( "colors.white" ).replace( "<alpha-value>", "1" ),
				backgroundColor: theme( "colors.dark" ).replace( "<alpha-value>", "1" ),
				boxShadow: `0 2px 4px 0 ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}, inset 0 -2px 2px 0 ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}, inset 0 2px 2px 0 ${theme( "colors.white" ).replace( "<alpha-value>", "0.30" )}`,
				border: 0,
				outline: 0,
				borderRadius: theme( "borderRadius.25" ),
				transition: "all 0.2s ease-out",
				"&:hover": {
					boxShadow: `0 1px 6px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}`,
				},
				"&:focus": {
					boxShadow: `inset 0 1px 6px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}`,
				},
				"&:disabled": {
					cursor: "auto",
				},
			},

			".button-shadow": {
				boxShadow: `0 2px 4px 0 ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}, inset 0 -2px 2px 0 ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}, inset 0 2px 2px 0 ${theme( "colors.white" ).replace( "<alpha-value>", "0.30" )}`,
				"&:hover": {
					boxShadow: `0 1px 6px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}`,
				},
				"&:focus": {
					boxShadow: `inset 0 1px 6px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.30" )}`,
				},
			},

			".input": {
				height: "var(--space-150)",
				padding: "0 var(--space-50)",
				fontSize: "var(--p)",
				color: "var(--dark)",
				backgroundColor: "transparent",
				border: 0,
				borderRadius: theme( "borderRadius.25" ),
				boxShadow: `inset 0 0 1px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.15" )}`,
				outline: 0,
				transition: "all 0.2s ease-out",
				"&:focus": {
					boxShadow: `inset 0 0 1px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.10" )}, inset 0 0 6px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.20" )}`,
				},
				"&:disabled": {
					color: theme( "colors.neutral-3" ),
				}
			},

			".input-shadow": {
				boxShadow: `inset 0 0 1px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.15" )}`,
				"&:focus-within": {
					boxShadow: `inset 0 0 1px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.10" )}, inset 0 0 6px 1px ${theme( "colors.black" ).replace( "<alpha-value>", "0.20" )}`,
				},
			},

			".textarea": {
				paddingTop: theme( "paddingTop.50" ),
				paddingBottom: theme( "paddingBottom.50" ),
				minHeight: "calc(var(--space-100) + (var(--p) * 3))",
			},

			".select": {
				cursor: "pointer",
				appearance: "none",
			}
		} )
	}, baseConfig )
}





export default conf
