
import sharp from "sharp"

import { isAFiniteNumber } from "./type-checking/number/identity"





const sharpConfiguration = {
	animated: true,
	sequentialRead: true,
}
const webPConfiguration = {
	quality: 81,
	effort: 6,
}
const webPBlurConfiguration = {
	quality: 69,
	effort: 6,
}





export function getMetadata ( path: string ) {
	return sharp( path, sharpConfiguration ).metadata()
}

export function resizeImage ( path: string, width: number ) {
	const transformPipeline = sharp( path, sharpConfiguration )
							.resize( width )
							.webp( webPConfiguration )

	return {
		write ( path ) {
			return transformPipeline.toFile( path )
		},
		pipe ( writableStream ) {
			return transformPipeline.pipe( writableStream )
		},
	}
}

export function resizeAndBlurImage ( path: string, width: number ) {
	const transformPipeline = sharp( path, sharpConfiguration )
	if ( isAFiniteNumber( width ) && width >= 8 ) {
		transformPipeline.resize( width )
	}
	transformPipeline.blur( 5 )
	transformPipeline.webp( webPBlurConfiguration )

	return {
		write ( path ) {
			return transformPipeline.toFile( path )
		},
		pipe ( writableStream ) {
			return transformPipeline.pipe( writableStream )
		},
	}
}
