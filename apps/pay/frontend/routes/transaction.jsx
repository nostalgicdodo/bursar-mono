
import { redirect } from "@remix-run/node"
import {
	useLoaderData,
	Link,
	Outlet
} from "@remix-run/react"

import pageStyles from "~/css/pages/transaction-home.css"

const { Rupee } = require( "~/lib/currency.js" )



const formatAsRupee = Rupee.createFormatter( { includeFractionalAmount: false } )



export async function loader ( { request, params, context } ) {
	const { transaction: transactionRecord } = context;

	if ( transaction.type === "DT" )
		return redirect( "/transaction/direct" )

	const { institute: instituteRecord } = context;

	// Prep data to send to client
	const institute = {
		name: instituteRecord.name,
		logoURL: instituteRecord.name.toLowerCase().replace( /\s+/g, "-" ) + "-logo.jpeg"
	}
	const transaction = {
		feesDue: transactionRecord.amount,
		feesDueFormatted: formatAsRupee( transactionRecord.amount )
	}
	const user = {
		name: transactionRecord.userName,
		id: transactionRecord.userId,
	}
	if ( typeof transactionRecord.userDetails === "object" )
		user.extended = transactionRecord.userDetails

	return {
		institute,
		user,
		transaction,
		lenders: [
			{ name: "Hyper Money", emiStartsAt: "₹21,250/-", logoURL: "lender-one.svg", featured: true },
			{ name: "LBI Bank", emiStartsAt: "₹21,350/-", logoURL: "lender-two.svg" },
			{ name: "Eazy Pay", emiStartsAt: "₹21,300/-", logoURL: "lender-three.svg" },
		],
	}
}

export const handle = {
	metaTitle: "Transaction",
	scripts: [
		{ src: "/scripts/jquery/jquery-v3.6.0.min.js" },
		{ src: "/scripts/utils.js" },
		{ src: "/scripts/navigation.js" },
	]
}

export function links () {
	return [
		pageStyles
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}

function LenderRowCard ( props ) {
	const { name, emiStartsAt, logoURL } = props
	let featured = null
	if ( props.featured )
		featured = <div className="featured small strong text-uppercase text-white">featured offer</div>

	return <div className="lender-row fill-purple-1 radius-50 space-50">
		{ featured }
		<div className="row">
			<div className="columns small-7 medium-3">
				<img src={`/media/logos/${logoURL}`} alt="" />
				<div className="label strong text-purple-2">Lender</div>
				<div className="h6 strong text-purple-3">{name}</div>
			</div>
			<div className="emi columns small-4 medium-2">
				<div className="label strong text-purple-2">EMI starts at</div>
				<div className="h6 strong text-purple-3">{emiStartsAt}</div>
			</div>
			<div className="columns small-12 medium-offset-4 medium-3">
				<button className="button block fill-purple-2 text-uppercase">Check Eligibility</button>
			</div>
		</div>
	</div>
}



export default function () {

	const { institute, user, transaction, lenders } = useLoaderData()

	const [ paymentFlowStatus, setPaymentFlowStatus ] = React.useState( "inactive" )
	const activatePaymentFlow = () => setPaymentFlowStatus( "active" )

	return <div className="container space-200-top-bottom">
		<div className="institute-insignia text-center"><img src={ `/media/logos/${institute.logoURL}` } alt="Institute Logo" /></div>
		<div className="h3 text-center text-indigo-3 space-100-bottom">👋 Welcome</div>
		<div className="user-info card radius-50 no-overflow">
			<div className="space-50">
				<div className="h4 text-indigo-3 space-25-bottom">{user.name}</div>
				<div className="label strong text-indigo-1 space-25-bottom">ID: {user.id}</div>
				<div className="label strong text-indigo-3 space-25-bottom">
					{user.extended.product}
					<br/>
					at <span>{institute.name}</span>
				</div>
			</div>
			<a className="fill-purple-1 space-50-top-bottom space-100-left-right" href="#section-payment-options">
				<div className="bold text-purple-2">Fee Amount Due</div>
				<div className="h5 strong text-purple-3">{transaction.feesDueFormatted}/- </div>
			</a>
		</div>

		<div className="payment-options radius-50 text-center space-75" id="section-payment-options">
			<div className="h5 bold text-indigo-3">Payment Options</div>
			<div ><img src="/media/logos/bursar-powered-by.svg" alt="bursar logo" /></div>
		</div>

		{ lenders.slice( 0, 1 ).map(
			l => <LenderRowCard name={l.name} emiStartsAt={l.emiStartsAt} logoURL={l.logoURL} featured={l.featured} key={l.name} />
		) }

		<section className="pay-now fill-light radius-50 space-50">
			<div className="h h4 strong text-purple-2">Pay Full Amount, Now</div>
			<div className="row">
				<div className="columns small-5">
					<div className="small strong text-purple-2 space-25-bottom">Total Fee Amount</div>
					<div className="h5 strong text-purple-3">{transaction.feesDueFormatted}/-</div>
				</div>
				<div className="columns small-offset-2 small-5 medium-offset-4 medium-3">
					<Link className="button block label strong text-purple-2" disabled={paymentFlowStatus === "active"} to="pay">Pay Now</Link>
				</div>
			</div>
		</section>

		{ lenders.slice( 1 ).map(
			l => <LenderRowCard name={l.name} emiStartsAt={l.emiStartsAt} logoURL={l.logoURL} featured={l.featured} key={l.name} />
		) }

		<Outlet />
		{/* <PaymentScreen status={paymentFlowStatus} /> */}
	</div>

}
