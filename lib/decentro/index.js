const request = require('request');
const DecentroAPICall = require('@models/decentroAPICall');
const { isProduction,
	getDecentroUrl,
	getDecentroAuthKeys,
	getDecentroCreditTestAccount } = require('@root/server');

function registerDecentroAPICall(operation, requestBody, responseBody){
	const decentroAPICall = new DecentroAPICall();
	decentroAPICall.create({
		time: new Date().toISOString(),
		operation,
		requestBody,
		responseBody,
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
};
