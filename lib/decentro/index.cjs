const request = require('request');
const DecentroAPICall = require('@models/decentroAPICall.cjs');
const { isProduction,
	getDecentroUrl,
	getDecentroAuthKeys,
	getDecentroCreditTestAccount,
	getDecentroPaymentCreds,
} = require('@root/server/index.cjs');
const DECENTRO_PAYMENT_CREDS = getDecentroPaymentCreds();

function registerDecentroAPICall(operation, requestBody, responseBody){
	const decentroAPICall = new DecentroAPICall();
	decentroAPICall.create({
		time: new Date().toISOString(),
		operation,
		requestBody,
		responseBody,
	});
}

function getDecentroTransactionStatus({
	transactionId,
}){
	return new Promise((resolve, reject) => {
		request({
			method: 'GET',
			url: `${ DECENTRO_PAYMENT_CREDS.url }/v3/payments/transaction/advance/status?decentro_txn_id=${ transactionId }`,
			headers: {
				client_id: DECENTRO_PAYMENT_CREDS.client_id,
				client_secret: DECENTRO_PAYMENT_CREDS.client_secret,
			},
			json: true,
		}, (error, response, body) => {
			registerDecentroAPICall('status', { transactionId }, body);
			if (error) return reject(error);
			resolve(body);
		});
	});
}

function generateDecentroTransactionSession({
	amount,
	transactionId,
	userId,
	userName,
	qr,
}){
	const requestBody = {
		amount,
		reference_id: transactionId,
		description: userName,
		// customer_phone: '7760118669',
		// customer_email: 'aditya.mohana.bhat+juspay@gmail.com',
		consumer_urn: DECENTRO_PAYMENT_CREDS.consumer_urn,
		purpose_message: 'Payment',
		expiry_time: 10,
		// udf6: `mId:${instituteId}`,
		// udf7: `refId:${refId}`,
	};
	return new Promise((resolve, reject) => {
		if(qr){
			requestBody.generate_custom_qr_image = false;
			request({
				method: 'POST',
				url: `${ DECENTRO_PAYMENT_CREDS.url }/v3/payments/upi/qr`,
				json: true,
				headers: {
					'Cache-Control': 'no-store',
					client_id: DECENTRO_PAYMENT_CREDS.client_id,
					client_secret: DECENTRO_PAYMENT_CREDS.client_secret,
				},
				body: requestBody,
			}, (error, _response, body) => {
				request({
					method: 'GET',
					url: body.data.qr_image,
				}, (err, _response, body2) => {
					registerDecentroAPICall('session-qr-body', requestBody, body);
					body.qrCode = body2;
					resolve(body);
				});
				registerDecentroAPICall('session-qr', requestBody, body);
				if (error || body.status === 'ERROR') return reject(error);
			});
		}else{
			requestBody.generate_psp_uri = true;
			request({
				method: 'POST',
				url: `${ DECENTRO_PAYMENT_CREDS.url }/v3/payments/upi/link`,
				json: true,
				headers: {
					'Cache-Control': 'no-store',
					client_id: DECENTRO_PAYMENT_CREDS.client_id,
					client_secret: DECENTRO_PAYMENT_CREDS.client_secret,
				},
				body: requestBody,
			}, (error, _response, body) => {
				registerDecentroAPICall('session', requestBody, body);
				if (error || body.status === 'ERROR') return reject(error);
				resolve(body);
			});
		}
	});
}

const generateCreditReport = isProduction() ? ({
	reference_id,
	name,
	date_of_birth,
	pincode,
	mobile,
	inquiry_purpose,
	document_type,
	document_id
}) => {
	return new Promise((resolve, reject) => {
		request({
			method: 'POST',
			url: `${ getDecentroUrl() }/v2/financial_services/credit_bureau/credit_report`,
			body: {
				reference_id,
				name,
				date_of_birth,
				// address_type,
				// address,
				pincode,
				mobile,
				inquiry_purpose,
				document_type,
				document_id,
			},
			headers: getDecentroAuthKeys('credit'),
			json: true
		}, function (error, response, body) {
			registerDecentroAPICall('credit', response.request.body, body);
			if (error) return reject(error);
			resolve(body);
		});
	});
} : ({
	reference_id,
	inquiry_purpose,
}) => {
	return new Promise((resolve, reject) => {
		request({
			method: 'POST',
			url: `${ getDecentroUrl() }/v2/financial_services/credit_bureau/credit_report`,
			body: {
				reference_id,
				// address_type,
				// address,
				inquiry_purpose,
				...getDecentroCreditTestAccount(),
			},
			headers: getDecentroAuthKeys('credit'),
			json: true
		}, function (error, response, body) {
			registerDecentroAPICall('credit', response.request.body, body);
			if (error) return reject(error);
			resolve(body);
		});
	});
};

function performCKYC({
	reference_id,
	consent_purpose,
	document_type,
	id_number
}){
	return new Promise((resolve) => {
		request({
			method: 'POST',
			url: `${ getDecentroUrl() }/v2/kyc/ckyc/search`,
			body: {
				reference_id,
				consent_purpose,
				document_type,
				consent: true,
				id_number,
			},
			headers: getDecentroAuthKeys(),
			json: true
		}, function (error, response, body) {
			registerDecentroAPICall('performkyc', response.request.body, body);
			if (error) return resolve(error);
			resolve(body);
		});
	});
}

function validateAadhaarDetailsGenerateCaptcha({
	reference_id,
	purpose,
}){
	return new Promise((resolve) => {
		request({
			method: 'POST',
			url: `${ getDecentroUrl() }/v2/kyc/aadhaar_connect`,
			body: {
				reference_id,
				purpose,
				consent: true,
			},
			headers: getDecentroAuthKeys(),
			json: true
		}, function (error, response, body) {
			registerDecentroAPICall('aadhaarcapatcha', response.request.body, body);
			if (error) return resolve(error);
			resolve(body);
		});
	});
}

function validateAadhaarDetailsRecaptcha({
	reference_id,
	purpose,
	initiation_transaction_id
}){
	return new Promise((resolve) => {
		request({
			method: 'POST',
			url: `${ getDecentroUrl() }/v2/kyc/aadhaar_connect/captcha/reload`,
			body: {
				reference_id,
				purpose,
				consent: true,
				initiation_transaction_id,
			},
			headers: getDecentroAuthKeys(),
			json: true
		}, function (error, response, body) {
			registerDecentroAPICall('aadhaarregencaptcha', response.request.body, body);
			if (error) return resolve(error);
			resolve(body);
		});
	});
}

function validateAadhaarDetailsGenerateOTP({
	reference_id,
	purpose,
	initiation_transaction_id,
	aadhaar_number,
	captcha,
}){
	return new Promise((resolve) => {
		request({
			method: 'POST',
			url: `${ getDecentroUrl() }/v2/kyc/aadhaar_connect/otp`,
			body: {
				reference_id,
				purpose,
				consent: true,
				initiation_transaction_id,
				aadhaar_number,
				captcha,
			},
			headers: getDecentroAuthKeys(),
			json: true
		}, function (error, response, body) {
			registerDecentroAPICall('aadhaargenotp', response.request.body, body);
			if (error) return resolve(error);
			resolve(body);
		});
	});
}

function validateAadhaarDetailsValidateOTP({
	reference_id,
	purpose,
	initiation_transaction_id,
	otp,
}){
	return new Promise((resolve) => {
		request({
			method: 'POST',
			url: `${ getDecentroUrl() }/v2/kyc/aadhaar_connect/otp/validate`,
			body: {
				reference_id,
				purpose,
				consent: true,
				initiation_transaction_id,
				otp,
			},
			headers: getDecentroAuthKeys(),
			json: true
		}, function (error, response, body) {
			registerDecentroAPICall('aadhaarvalotp', response.request.body, body);
			if (error) return resolve(error);
			resolve(body);
		});
	});
}

module.exports = {
	generateCreditReport,
	performCKYC,
	validateAadhaarDetailsGenerateCaptcha,
	validateAadhaarDetailsRecaptcha,
	validateAadhaarDetailsGenerateOTP,
	validateAadhaarDetailsValidateOTP,
	generateDecentroTransactionSession,
	getDecentroTransactionStatus,
};
