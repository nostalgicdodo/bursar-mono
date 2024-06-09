
/**
 |
 |
 |
 | Last updated: 01/06/2023
 |
 */

import { State } from "country-state-city"

const IN_States = [
	{ name: "Andhra Pradesh", code: "AD" },
	{ name: "Arunachal Pradesh", code: "AR" },
	{ name: "Assam", code: "AS" },
	{ name: "Bihar", code: "BR" },
	{ name: "Chattisgarh", code: "CG" },
	{ name: "Goa", code: "GA" },
	{ name: "Gujarat", code: "GJ" },
	{ name: "Haryana", code: "HR" },
	{ name: "Himachal Pradesh", code: "HP" },
	{ name: "Jharkhand", code: "JH" },
	{ name: "Karnataka", code: "KA" },
	{ name: "Kerala", code: "KL" },
	{ name: "Madhya Pradesh", code: "MP" },
	{ name: "Maharashtra", code: "MH" },
	{ name: "Manipur", code: "MN" },
	{ name: "Meghalaya", code: "ML" },
	{ name: "Mizoram", code: "MZ" },
	{ name: "Nagaland", code: "NL" },
	{ name: "Odisha", code: "OD" },
	{ name: "Punjab", code: "PB" },
	{ name: "Rajasthan", code: "RJ" },
	{ name: "Sikkim", code: "SK" },
	{ name: "Tamil Nadu", code: "TN" },
	{ name: "Telangana", code: "TS" },
	{ name: "Tripura", code: "TR" },
	{ name: "Uttar Pradesh", code: "UP" },
	{ name: "Uttarakhand", code: "UK" },
	{ name: "West Bengal", code: "WB" },
]

const IN_Union_Territories = [
	{ name: "Andaman and Nicobar Islands", code: "AN" },
	{ name: "Chandigarh", code: "CH" },
	{ name: "Dadra and Nagar Haveli and Daman and Diu", code: "DNHDD" },
	{ name: "Delhi", code: "DL" },
	{ name: "Jammu and Kashmir", code: "JK" },
	{ name: "Ladakh", code: "LA" },
	{ name: "Lakshadweep", code: "LD" },
	{ name: "Puducherry", code: "PY" },
	// { name: "Other Territory", code: "OT" },
]

// export const IN_Places_That_Receive_Deliveries = IN_States.concat( IN_Union_Territories )

export const IN_Places_That_Receive_Deliveries = State.getStatesOfCountry( "IN" )
