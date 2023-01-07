
function RGB ( r, g, b ) {
	if ( ! ( this instanceof RGB ) )
		return new RGB( r, g, b )

	this.red = r
	this.green = g
	this.blue = b
}
RGB.prototype.toString = function toString () {
	if ( ! this.alpha )
		return `rgb( ${this.red}, ${this.green}, ${this.blue} )`
	else
		return `rgba( ${this.red}, ${this.green}, ${this.blue}, ${this.alpha} )`
}
RGB.prototype.a = function a ( value ) {
	this.alpha = value
	return this
}





const colors = {
	// Neutral colors
	white: RGB( 255, 255, 255 ),
	light: "#FCFAFE",
	neutral1: "#E1DFE3",
	neutral2: "#C6C4C8",
	neutral3: "#ABA9AD",
	neutral4: "#8F8E92",
	neutral5: "#747377",
	neutral6: "#59585C",
	neutral7: "#3E3D41",
	dark: "#222125",
	black: RGB( 0, 0, 0 ),
	// Highlight colors
	purple1: "#E2D6F8",
	purple2: RGB( 138, 92, 229 ),
	purple3: "#3C3055",
	indigo1: "#BFB7F5",
	// indigo2: "#6C5CE7",
	indigo2: RGB( 108, 92, 231 ),
	indigo3: "#423B7A",
	blue1: "#C5CBFF",
	blue2: "#7A88FF",
	blue3: "#484E84",
}





const theme = {
	backgroundColors: {
		colorBackgroundPrimary: colors.indigo2.toString(),
		colorBackgroundPrimaryStronger: colors.purple2.toString(),
		colorBackgroundBrandStrong: colors.purple2.toString(),
	},
	borderColors: {
		colorBorderPrimary: colors.indigo2.toString(),
		colorBorderNeutral: colors.indigo2.toString(),
		colorBorderPrimaryStronger: colors.purple2.toString(),
	},
	textColors: {
		colorTextLink: colors.indigo2.toString(),
		colorTextLinkStronger: colors.purple2.toString(),
	},
	fonts: {
		fontHeadingText: `"Playfair Display", Times, serif`,
		fontFamilyText: `"Montserrat", Arial, sans-serif`,
	},
	shadows: {
		// shadowBorderPrimary: `0 0 0 1px ${rgb( colors.indigo2 )}`,
		shadowBorderPrimary: `0 2px 4px 0 ${colors.black.a( 0.3 )}, inset 0 -2px 2px 0 ${colors.black.a( 0.3 )}, inset 0 2px 2px 0 ${colors.white.a( 0.3 )}`,
		// shadowBorderPrimaryStronger: `0 0 0 1px ${rgb( colors.purple2 )}`,
		shadowBorderPrimaryStronger: `0 1px 6px 1px ${colors.black.a( 0.3 )}`,
		shadowFocus: `0 0 0 4px ${colors.indigo2.a( 0.7 )}`,
		shadowFocusInset: `inset 0 0 0 2px ${colors.indigo2.a( 0.7 )}`,
	},
}

// export const HEADING = {
// 	fonts: {
// 		fontHeadingText: `"Playfair Display", Times, serif`,
// 	},
// }



export default theme
export { colors }
export const tokens = {
	colors
}
