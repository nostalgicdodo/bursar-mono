
import { redirect } from "@remix-run/node"
import {
	useLoaderData,
} from "@remix-run/react";
import * as React from "react"
import { ClientOnly } from "remix-utils"
import { useMachine } from "@xstate/react"

import { PaymentFlowMachine } from "~/state-machines/PaymentFlowMachine.js"
import { PaymentVerificationMachine } from "~/state-machines/PaymentVerificationMachine.js"
import { LoadingIndicator } from "@ui/components/loading-indicator"
import { Popup } from "@ui/components/popup"
import CountDownBar, { styles as CountDownBarStyles } from "~/components/countdown-bar"
import { FormNavigate } from "@ui/components/form-navigate"
const { Rupee } = require( "@ui/utils/currency.js" )

import modalStyles from "@ui/css/modules/modal.css"
import pageStyles from "~/css/pages/order-checkout.css"





const formatAsRupee = Rupee.createFormatter( { includeFractionalAmount: false } )





export function meta ( { data } ) {
	return {
		title: "Payment Confirmation | " + data?.order?.product.brand.name + " | Powered by bursar"
	}
}

export function links () {
	return [
		modalStyles,
		pageStyles,
		CountDownBarStyles,
	].map( styles => ({ rel: "stylesheet", type: "text/css", href: styles }) )
}



export async function loader ( { request, params, context } ) {
	const { session } = context

	if ( !session.transaction || session.transaction.doc.status.toLowerCase() !== "initiated" )
		return redirect( "/404" )



	context = {
		sessionExpiresOn: session.transaction.doc.expiresOn,
		order: {
			id: session.transaction.doc.id,
			pgOrderId: session.transaction.doc.pgOrderId,
			refId: session.transaction.doc.refId,
			refUniqueId: session.transaction.doc.refUniqueId,
			product: {
				// name: "Bachelor of Arts (B.A.)",
				brand: {
					// name: "Test Greendale Community College"
					name: session.institute.doc.name
				},
			},
			amount: session.transaction.doc.amount,
			status: session.transaction.doc.status,
			createdAt: session.transaction.doc.createdAt,
			expiresAt: session.transaction.doc.expiresOn,
			failureRedirectURL: session.transaction.doc.failureRedirect,
			successRedirectURL: session.transaction.doc.successRedirect,
		},
		user: {
			id: session.transaction.doc.userId,
			name: session.transaction.doc.userName,
			// id: "ANIDEYUNIQ",
			// name: "Stu Dent"
		}
	}

	/*
	 |
	 | Prep data to be sent to the client
	 |
	 |
	 */
	// Session
	const sessionExpiresOn = context.sessionExpiresOn
	// Order
	const order = context.order
	order.amountFormatted = formatAsRupee( order.amount )
	order.product.brand.logoURL = order.product.brand.name?.toLowerCase().replace( /\s+/g, "-" ) + ".png"
	// User
	const user = context.user

	return {
		sessionExpiresOn,
		user,
		order,
	}
}

export default function () {
	const { sessionExpiresOn, order, user } = useLoaderData()

	const [ paymentFlowState, paymentFlowSend ] = useMachine( PaymentFlowMachine, {
		context: {
			forLogs: { order, user },
			sessionExpiresOn,
			paymentHasInitialised: order.pgOrderId ? true : false,
		}
	} )
	const [ paymentVerificationState, paymentVerificationSend ] = useMachine( PaymentVerificationMachine, {
		context: {
			forLogs: { order, user },
			sessionExpiresOn,
			orderCreatedAt: new Date( order.createdAt ),
			mostRecentOrderStatus: order.status,
		}
	} )
	const [ readyToRedirect, setReadyToRedirect ] = React.useState( false )
	const [ redirectPayload, setRedirectPayload ] = React.useState( null )



	usePromptBeforeUnloading( [
		// paymentFlowState.matches( "in-session" ),
		redirectPayload, /* this would be set *right before* the page navigates away */
	], function ( /* paymentFlowIsInSession, */ redirectPayload ) {
		if ( redirectPayload ) {
			return false
		}
		// if ( paymentFlowState.matches( "in-session" ) ) {
		// 	return false
		// }
		return true
	} )

	/*
	 |
	 | If the payment has been verified,
	 |	wait for a few seconds
	 |	and then set `readyToRedirect` to true
	 |
	 |
	 */
	React.useEffect( function () {
		if ( ! paymentVerificationState.matches( "verified" ) )
			return;

		let timeoutId = window.setTimeout( function () {
			setReadyToRedirect( true )
		}, 5000 )

		return () => {
			window.clearTimeout( timeoutId )
			timeoutId = null
		}
	}, [ paymentVerificationState ] )

	/*
	 |
	 | If the payment session has been expired,
	 |	wait for a few seconds
	 |	and then set `readyToRedirect` to true
	 |
	 |
	 */
	React.useEffect( function () {
		if ( ! paymentFlowState.matches( "terminated" ) ) {
			return
		}

		let timeoutId = window.setTimeout( function () {
			setReadyToRedirect( true )
		}, 5000 )

		return () => {
			window.clearTimeout( timeoutId )
			timeoutId = null
		}
	}, [ paymentFlowState ] )

	/*
	 |
	 | Prepare the callback request payload
	 |
	 |
	 */
	React.useEffect( function () {
		if ( ! readyToRedirect )
			return;
		setRedirectPayload( Object.entries( {
			status: paymentVerificationState.context.mostRecentOrderStatus === "success" ? "success" : "failed",
			id: order.id,
			refId: order.refId,
			refUniqueId: order.refUniqueId,
			userId: user.id,
			amount: order.amount,
			expiresOn: order.expiresAt,
		} ) )
	}, [ readyToRedirect ] )

	// Initiate the payment verification state machine
	// 	once the payment flow state machine reaches its final state
	React.useEffect( function () {
		if ( ! paymentFlowState.matches( "closed" ) ) {
			return
		}
		paymentVerificationSend( "INITIATE" )
	}, [ paymentFlowState ] )



	if ( paymentFlowState.matches( "determining-initial-state" ) ) {
		return null
	}

	return <div className="container space-200-top-bottom">

		{ ( readyToRedirect && redirectPayload ) && <>
			<FormNavigate url={paymentVerificationState.context.mostRecentOrderStatus === "success" ? order.successRedirectURL : order.failureRedirectURL} method="POST" body={redirectPayload} />
		</> }

		<div className="institute-insignia text-center"><img src={ `/media/logos/${order.product.brand.logoURL}` } alt="Institute Logo" /></div>
		<div className="h3 text-center text-indigo-3 space-100-bottom">
			{/* { ( paymentVerificationState.matches( "idle" ) && !paymentFlowState.matches( "terminated" ) ) ? "Payment Confirmation" : "Payment Verification" } */}
			{ paymentFlowState.matches( "terminated" ) && "Session Expired" }
			{ !paymentFlowState.matches( "terminated" ) && <>
				{ paymentVerificationState.matches( "idle" ) ? "Payment Confirmation" : "Payment Verification" }
			</> }
		</div>

		{ paymentFlowState.matches( "terminated" ) && <>
			<PaymentSessionExpiredNotice />
		</> }

		{ ( ! paymentVerificationState.matches( "idle" ) ) && <>
			<PaymentVerificationNotice state={ paymentVerificationState } sessionExpiresOn={ sessionExpiresOn } />
		</> }

		<UserInfoCard user={ user } order={ order } paymentVerificationState={ paymentVerificationState } />

		{ ( paymentVerificationState.matches( "idle" ) && !paymentFlowState.matches( "terminated" ) ) && <>
			<ClientOnly>
				{ () => <CountDownBar expiresOn={ sessionExpiresOn } message={ "Time remaining to make payment:" } endMessage={ "The session has expired." } onExpiry={ () => paymentFlowSend( "TERMINATE_PAYMENT" ) } className="columns large-6 large-offset-3 medium-8 medium-offset-2 space-25-top space-50-bottom space-25-left-right" /> }
			</ClientOnly>
		</> }

		{ ( !paymentFlowState.matches( "closed" ) && !paymentFlowState.matches( "terminated" ) ) && <>
			<section className="pay-now space-50 columns medium-offset-2 medium-8 large-offset-3 large-6 fill-light radius-50">
				<div className="h h4 strong text-purple-2">Pay Full Amount, Now</div>
				<div className="row">
					<div className="columns small-5">
						<div className="small strong text-purple-2">Total Fee Amount</div>
						<div className="h5 strong text-purple-3">{order.amountFormatted}/-</div>
					</div>
					<div className="columns small-offset-1 small-6 medium-offset-3 medium-4 large-offset-3">
						<button className="button block label strong text-purple-2" onClick={ () => paymentFlowSend( { type: "TRIGGER_PAYMENT_FLOW", pg: "juspay" } ) }>Make payment</button>
					</div>
				</div>
			</section>
		</> }

		{/*
		  |
		  | Render the popup for both the "initiating" and the "in-session" states
		  |
		  | Else the popup will close when the "in-session" state is entered.
		  |
		  */}
		{ ( paymentFlowState.matches( "initiating" ) || paymentFlowState.matches( "in-session" ) ) && <>
			<PaymentInSessionModal>
				{ ( paymentFlowState.matches( "initiating.attempting" ) ) && <>
					<div className="p">Initiating payment...</div>
				</> }
				{ ( paymentFlowState.matches( "initiating.failed" ) ) && <>
					<div className="p">Failed to initiate the payment flow.</div>
				</> }
				{ ( paymentFlowState.matches( "in-session" ) ) && <>
					<div className="p space-50-top hidden">Alternatively, you can <a className="strong text-underline cursor-pointer" onClick={ () => paymentFlowSend( "CLOSE" ) }>abort this payment</a>.</div>
				</> }
			</PaymentInSessionModal>
			<Popup
				name="payment-flow"
				href="/order/pay"
				size="contained-landscape"
				onMount={ () => paymentFlowSend( "REPORT_INITIATE_SUCCESS" ) }
				onClose={ () => paymentFlowSend( "CLOSE" ) }
				onError={ () => paymentFlowSend( "REPORT_INITIATE_ERROR" ) }
			/>
		</> }

		<Footer imageURL={ `/media/logos/${ order.product.brand.logoURL }` } />

	</div>
}



/*
 |
 | Helper components
 |
 |
 */
function PaymentInSessionModal ( { children } ) {
	return <Modal>
		<div className="payment-in-session text-light">
			<div className="container space-200-top-bottom">
				<div className="columns small-offset-1 small-10 medium-offset-3 medium-6">
					<div className="space-75-bottom"><img className="bursar-logo" src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" style={{ minHeight: "36px" }} /></div>
					<div className="h4 space-50-bottom">Payment is in session.</div>
					<div className="p space-25-bottom">Don’t see the secure browser window?</div>
					<div className="p space-25-bottom">If not, kindly ensure that popups are allowed (on your browser and/or anti-virus software), and then try again.</div>
					{ children }
				</div>
			</div>
		</div>
	</Modal>
}

function Modal ( { children } ) {
	return <div className="modal-container">
		{ children }
	</div>
}

function usePromptBeforeUnloading ( dependencies, conditionalFn ) {
	React.useEffect( function () {
		const effectShouldRun = conditionalFn( ...dependencies )
		if ( ! effectShouldRun ) {
			return
		}

		function promptBeforeUnloading ( event ) {
			event.preventDefault()
			return "Are you sure? You might have to make the payment again from the start."
		}
		window.addEventListener( "beforeunload", promptBeforeUnloading, { capture: true } )
		window.onbeforeunload = () => false
		return () => {
			window.onbeforeunload = null
			window.removeEventListener( "beforeunload", promptBeforeUnloading, { capture: true } )
		}
	}, dependencies )
}

function PaymentSessionExpiredNotice () {
	return <section className="pay-verify space-50 columns medium-offset-2 medium-8 large-offset-3 large-6 fill-light radius-50">
		<div>
			<div className="h h4 strong text-purple-2">
				The payment session has timed out.
			</div>
			<div className="p text-neutral-7" style={{ maxWidth: "25ch" }}>
				We are redirecting you back...
				<br />
				<br />
				Do not <i>refresh</i> this page, hit the <i>back button</i>, or <i>close</i> this window.
			</div>
		</div>
		<LoadingIndicator />
	</section>
}

function PaymentVerificationNotice ( { state, sessionExpiresOn } ) {
	return <section className="pay-verify space-50 columns medium-offset-2 medium-8 large-offset-3 large-6 fill-light radius-50">
		<div>
			<div className="h h4 strong text-purple-2">
				{ ( ! state.matches( "verified" ) ) && <>
					Verifying payment...
				</> }
				{ state.matches( "verified" ) && <>
					{ state.context.mostRecentOrderStatus === "success" ? "Payment Successful" : "There was an issue" }
				</> }
			</div>
			<div className="p text-neutral-7" style={{ maxWidth: "25ch" }}>
				{ state.matches( "verified" ) && <>
					We are redirecting you back...
					<br />
					<br />
				</> }
				{ ( ! state.matches( "verified" ) && state.context.verificationAttempts >= 2 ) && <>
					<span style={{ whiteSpace: "nowrap" }}>This might take up to <b>{ Math.ceil( ( sessionExpiresOn - Date.now() ) / ( 60 * 1000 ) ) }</b> minutes.</span>
					{ ( ! state.matches( "verified" ) ) && <>
						<ClientOnly>
							{ () => <CountDownBar expiresOn={ sessionExpiresOn } countdown={ false } className="space-25-top" /> }
						</ClientOnly>
					</> }
				</> }
				Do not <i>refresh</i> this page, hit the <i>back button</i>, or <i>close</i> this window.
			</div>
		</div>
		{ ( ! state.matches( "verified" ) ) && <>
			<LoadingIndicator />
		</> }
	</section>
}

function UserInfoCard ( { user, order, paymentVerificationState } ) {
	return <div className="user-info card columns large-6 large-offset-3 medium-8 medium-offset-2 radius-50 no-overflow">
		<div className="space-50">
			<div className="h4 text-indigo-3 space-25-bottom">{user.name}</div>
			<div className="label strong text-indigo-1 space-25-bottom">ID: {user.id}</div>
			<div className="label strong text-indigo-3 space-25-bottom">
				{/* If both the course name and institute name are available */}
				{ order.product.name && order.product.brand?.name && <>
					{ order.product.name }
					<br/>
					at <span>{ order.product.brand.name }</span>
				</> }
				{/* If only the course name is available */}
				{ order.product.name && ! order.product.brand?.name && <>
					{ order.product.name }
				</> }
				{/* If only the institute name is available */}
				{ order.product.brand?.name && !order.product.name && <>
					<span>{ order.product.brand.name }</span>
				</> }
			</div>
		</div>
		<div className="fill-purple-1 space-50-top-bottom space-100-left-right">
			<div className="bold label text-purple-2">Fee Amount { paymentVerificationState.matches( "idle" ) && "Due" }</div>
			<div className="h5 strong text-purple-3">{order.amountFormatted}/- </div>
		</div>
	</div>
}

function Footer ( { imageURL } ) {
	return <div className="footer" style={{ marginTop: "var(--space-200)" }}>
		{ imageURL && <>
			<img className="institute-logo" src={ imageURL } alt="Institute logo" />
			<span className="vd"></span>
		</> }
		<img className="bursar-logo" src="/media/logos/bursar-powered-by.svg" alt="Powered by Bursar" />
	</div>
}
