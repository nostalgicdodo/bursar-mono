
/**
 |
 | Payment Options (ideal static version)
 |
 | This is a consolidate view of payment options (UPI PSP providers), alongside a QR code
 | Dated: 09/06/2024
 |
 |
 */

import { Link } from "@remix-run/react"





export function PaymentOptionsIdealStaticVersion ( { className = "" } ) {
	return <section className={ `p-50 border border-purple-2 bg-light rounded-50 ${ className }` }>
		<h2 className="h4 font-serif font-bold text-purple-2">
			Make Payment
		</h2>
		<div>
			<p className="mt-50 h6 text-neutral-7">Select payment provider</p>
			<ul className="mt-25 flex flex-wrap gap-25">
				{ paymentProviders.map( ( { name, logoPath, classes }, i ) => <li key={ i }>
					<Link>
						<figure className="p-25 border border-purple-2 rounded-25 hover:bg-purple-1">
							<img src={ `/media/logos/payment-providers/${ logoPath }` } alt="" className={ `h-75 ${ classes }` } />
							<figcaption className="sr-only">{ name }</figcaption>
						</figure>
					</Link>
				</li> ) }
			</ul>
		</div>
		<div className="mt-100 flex items-center gap-25">
			<hr className="grow border border-purple-2 rounded-25" />
			<p className="h5 uppercase">or</p>
			<hr className="grow border border-purple-2 rounded-25" />
		</div>
		<div className="mt-75">
			<p className="mt-50 h6 text-neutral-7 text-center">Scan QR code</p>
			<figure>
				<img src="/media/other/qr-code-to-wikipedia.svg" alt="" className="-mt-75 mx-auto mix-blend-multiply" />
			</figure>
		</div>
	</section>
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
