
import { Link } from "@remix-run/react"
import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"

import http from "@/utilities/http"
import useScript from "@/ui/react/hooks/useScript"





export function PaymentOptionsWithDecentro ( { className = "" } ) {
	const deviceType = useDeviceType()
	let paymentOptionOrLoadingIndicator
	if ( deviceType === null ) {
		paymentOptionOrLoadingIndicator = null
	}
	else if ( deviceType === "mobile" ) {
		paymentOptionOrLoadingIndicator = <LinkPaymentOption />
	}
	else /* if ( deviceType !== "mobile" ) */ {
		paymentOptionOrLoadingIndicator = <ImagePaymentOption />
	}

	return <section className={ `p-50 border border-purple-2 bg-light rounded-50 ${ className }` }>
		<h2 className="h4 font-serif font-bold text-purple-2">
			Make Payment
		</h2>
		{ paymentOptionOrLoadingIndicator }
	</section>
}






/*
 |
 | Helpers
 |
 |
 */
function useDeviceType () {
	const [ deviceType, setDeviceType ] = useState<"mobile" | "tablet" | "smarttv" | "console" | "wearable" | "embedded" | "xr" | null>( null )
	const uaAgentParserScriptStatus = useScript( "https://cdn.jsdelivr.net/npm/ua-parser-js/dist/ua-parser.pack.min.js" )

	useEffect( function () {
		if ( uaAgentParserScriptStatus !== "ready" ) {
			return
		}
		const uaParser = new UAParser( navigator.userAgent )
		setDeviceType( uaParser.getDevice().type )
	}, [ uaAgentParserScriptStatus ] )

	return deviceType
}

function LinkPaymentOption ( { className = "" } ) {
	const paymentLinks = useUPILinks()

	return <div className={ className }>
		<p className="mt-50 h6 text-neutral-7">Select payment provider</p>
		<ul className="mt-25 flex flex-wrap gap-25">
			{ paymentLinks.map( ( { link, name, logoPath, classes }, i ) => <li key={ i }>
				<Link to={ link }>
					<figure className="p-25 border border-purple-2 rounded-25 hover:bg-purple-1">
						<img src={ `/media/logos/payment-providers/${ logoPath }` } alt="" className={ `h-75 ${ classes }` } />
						<figcaption className="sr-only">{ name }</figcaption>
					</figure>
				</Link>
			</li> ) }
		</ul>
	</div>
}

function useUPILinks ( qrCodeURL ) {
	return useQuery( {
		queryKey: [ qrCodeURL ],
		queryFn: async function () {
			const upiLinks = await http.get( qrCodeURL, { mode: "no-cors" } ).promise
			return upiLinks
		}
	} )
}

const paymentProviders = [
	{
		name: "Google Pay",
		logoPath: "google-pay.svg",
		classes: "",
	},
	{
		name: "PhonePe",
		logoPath: "phone-pe.svg",
		classes: "-translate-y-[1px]",
	},
	{
		name: "PayTM",
		logoPath: "pay-tm.svg",
		classes: "-translate-y-[1px]",
	},
	{
		name: "CRED",
		logoPath: "cred.png",
		classes: "translate-y-[1px]",
	},
]



function ImagePaymentOption ( { className = "" } ) {
	const qrCodeImage = useQRCodeImage()

	return <div className={ className }>
		<p className="mt-50 h6 text-neutral-7 text-center">Scan QR code</p>
		{ qrCodeImage.data && <figure>
			<img src={ qrCodeImage.data } alt="" className="mx-auto mix-blend-multiply" />
		</figure> }
	</div>
}

function useQRCodeImage ( qrCodeURL ) {
	return useQuery( {
		queryKey: [ qrCodeURL ],
		queryFn: async function () {
			const qrCodeHTML = await http.get( qrCodeURL, { mode: "no-cors" } ).promise
			const qrCodeImageData = qrCodeHTML?.match( /"(data:image.+)"/ )?.[ 1 ]
			return qrCodeImageData
		}
	} )
}
