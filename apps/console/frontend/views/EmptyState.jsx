
/* DISCLAIMER: this is an example, not meant to be used in production */

import { Box } from "@twilio-paste/core/box";
import { Button } from "@twilio-paste/core/button";
import { Heading } from "@twilio-paste/core/heading";
import { Paragraph } from "@twilio-paste/core/paragraph";

import { NoResultsIllustration } from "~/views/NoResultsIllustration";

export function EmptyState ({
	handleClearAll
}) {
	return <Box
		height="size30"
		borderStyle="solid"
		borderColor="colorBorderWeaker"
		borderWidth="borderWidth20"
		display="flex"
		justifyContent="center"
		alignItems="center"
		columnGap="space110"
	>
		<Box width="size20" aria-hidden="true">
			<NoResultsIllustration />
		</Box>
		<Box>
			<Heading as="div" variant="heading30">
				No results found
			</Heading>
			<Paragraph>Try changing the filters or the search term.</Paragraph>
			<Button variant="secondary" onClick={handleClearAll}>
				Clear all
			</Button>
		</Box>
	</Box>
}
