
import slug from "@/packages/slug"

export default function sanitizeFileName ( name: string ) {
	return slug( name )
		.slice( 0, 100 )
			// ^ limit file name length
		.replace( /-$/, "" )
			// ^ trim off the trailing hypen (if present)
}
