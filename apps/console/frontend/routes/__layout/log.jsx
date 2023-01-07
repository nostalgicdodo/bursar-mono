
import { Box } from '@twilio-paste/core/box'
import { TransactionReport } from "~/views/TransactionReport";


export const handle = {
	pageTitle: "Log"
}

export async function loader () {
	return null
}

export default function () {
	return <Box paddingBottom="space200">
		<TransactionReport />
	</Box>
}
