
/**
 |
 | Region data
 |
 | Region codes used are the ISO 3166-1 alpha 2 codes
 |
 */

export const regionCodeToCountryName = {
	IN: "India",
	US: "United States",
} as const

export type RegionCodeToCountryName = typeof regionCodeToCountryName
export type RegionCodes = keyof RegionCodeToCountryName

export const regionCodes = Object.keys( regionCodeToCountryName )
