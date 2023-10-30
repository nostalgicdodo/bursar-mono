
/**
 |
 | Phone -related data
 |
 | Region codes used are the ISO 3166-1 alpha 2 codes
 |
 */

import { invertRecord } from "@/utils/objects"
import { RegionCodeToCountryName, regionCodeToCountryName } from "./regions-and-locations/regions"

export const regionCodeToPhoneCode = {
	IN: "91",
	US: "1",
} as const

export const phoneCodeToRegionCode = invertRecord( regionCodeToPhoneCode )
export type PhoneCodeToRegionCode = typeof phoneCodeToRegionCode

export const phoneRegions = Object.keys( regionCodeToCountryName ).map( function ( regionCode ) {
	return [
		"+" + regionCodeToPhoneCode[ regionCode ],
		regionCodeToCountryName[ regionCode ] + " (+" + regionCodeToPhoneCode[ regionCode ] + ")",
	]
} )
	// ^ an array of arrays; each element is of the form: [ {region code}, {country name (region code)} ]
