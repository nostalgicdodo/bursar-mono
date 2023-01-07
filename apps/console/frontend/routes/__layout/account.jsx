
import { useUID } from "@twilio-paste/uid-library"

import { Grid, Column } from "@twilio-paste/core/grid"
import { Flex } from "@twilio-paste/core/flex"
import { Stack } from "@twilio-paste/core/stack"
import { Separator } from "@twilio-paste/core/separator"
import { Box } from "@twilio-paste/core/box"
import { Text } from "@twilio-paste/core/text"
import { Label } from "@twilio-paste/core/label"
import { HelpText } from "@twilio-paste/core/help-text"
import { Input } from "@twilio-paste/core/input"
import { Button } from "~/components/twilio-paste-overrides"

import { MoreIcon } from "~/server/proxies/icons"


export const handle = {
	pageTitle: "Account"
}

export async function loader () {
	return null
}

export default function () {
	return <>
		<Box paddingBottom="space200">
			<Grid>
				<Column span={[ 12, 3 ]} offset={0}>
					<Stack orientation="vertical" spacing="space70">
						<UserCurrentPasswordInput />
						<UserNewPasswordInput />
					</Stack>
				</Column>
			</Grid>
			<Box marginTop="space70">
				<Button type="submit" variant="primary">Update</Button>
			</Box>
		</Box>
	</>
}



function UserCurrentPasswordInput () {
	const inputId = useUID()
	const ariaId = useUID()
	return <Box minWidth="240px">
		<Label htmlFor={inputId}>Current Password</Label>
		<Input aria-describedby={ariaId} id={inputId} name="userCurrentPassword" type="password" />
		{/* <HelpText id={ariaId}>Use the password provided to you.</HelpText> */}
	</Box>
}

function UserNewPasswordInput () {
	const inputId = useUID()
	const ariaId = useUID()
	return <Box minWidth="240px">
		<Label htmlFor={inputId}>New Password</Label>
		<Input aria-describedby={ariaId} id={inputId} name="userNewPassword" type="password" />
		{/* <HelpText id={ariaId}>Use the password provided to you.</HelpText> */}
	</Box>
}
