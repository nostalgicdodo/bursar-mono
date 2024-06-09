
import dayjs from "dayjs"
	import advancedFormat from "dayjs/plugin/advancedFormat"

dayjs.extend( advancedFormat )

export default dayjs

// dayjs( createdAt ).format( "MMMM Do, YYYY" )
