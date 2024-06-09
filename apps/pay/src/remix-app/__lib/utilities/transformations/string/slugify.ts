
/**
 |
 | Slugify
 |
 | Example:
 | 	"^%&hEy-*&Wh@at-ãre|yóu\doing?" -> "hey-wh-at-re-y-udoing"
 |
 | NOTE: The `slug` npm package is being used in favor of this.
 |
 |
 */

export default function slugify ( text: string ) {
	return text
		.toLocaleLowerCase()
		.replace( /[^\w]+/g, "-" )
			// ^ replace non-Latin characters with "-"
			// 	this unfortunately removes letters with diacritics
		.replace( /^\-+/, "" )
			// ^ trims off any "-" at the start
		.replace( /\-+$/, "" )
			// ^ trims off any "-" at the end
}
