const request = require('request');
const JuspayAPICall = require('@models/juspayAPICall');
const { getJuspayCreds } = require('@root/server');
const JUSPAY_CREDS = getJuspayCreds();

function registerJuspayAPICall(operation, requestBody, responseBody){
	const juspayAPICall = new JuspayAPICall();
	juspayAPICall.create({
		time: new Date().toISOString(),
		operation,
		requestBody,
		responseBody,
	});
}

function generateTransactionSession({
	amount,
	transactionId,
	userId,
	userName,
	instituteId,
	refId,
}){
	const requestBody = {
		amount,
		order_id: transactionId,
		customer_id: userId,
		description: userName,
		// customer_phone: '7760118669',
		// customer_email: 'aditya.mohana.bhat+juspay@gmail.com',
		payment_page_client_id: JUSPAY_CREDS.paymentPageClientId,
		action: 'paymentPage',
		// udf6: `mId:${instituteId}`,
		// udf7: `refId:${refId}`,
	};
	return new Promise((resolve, reject) => {
		request({
			method: 'POST',
			url: `${ JUSPAY_CREDS.url }/session`,
			json: true,
			headers: {
				'Cache-Control': 'no-store',
				Authorization: `Basic ${ JUSPAY_CREDS.key }`,
			},
			body: requestBody,
		}, (error, _response, body) => {
			registerJuspayAPICall('session', requestBody, body);
			if (error || body.status === 'ERROR') return reject(error);
			resolve(body);
		});
	});
}

function getTransactionStatus({
	transactionId,
}){
	return new Promise((resolve, reject) => {
		request({
			method: 'GET',
			url: `${ JUSPAY_CREDS.url }/orders/${ transactionId }`,
			headers: {
				Authorization: `Basic ${ JUSPAY_CREDS.key }`,
			},
			json: true,
		}, (error, response, body) => {
			registerJuspayAPICall('status', { transactionId }, body);
			if (error) return reject(error);
			resolve(body);
		});
	});
}

module.exports = {
	generateTransactionSession,
	getTransactionStatus,
};
