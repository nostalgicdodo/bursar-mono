const Transaction = require('@models/transaction');
const { performCKYC,
	validateAadhaarDetailsGenerateCaptcha,
	validateAadhaarDetailsRecaptcha,
	validateAadhaarDetailsGenerateOTP,
	validateAadhaarDetailsValidateOTP,
	generateCreditReport } = require('@lib/decentro');
const {transactionUserDetailsValidation} = require('./validations');
const PURPOSE = 'For education loan disbursement';
const { generateTransactionSession } = require('@lib/juspay');
const { checkAndUpdateTrn } = require('@lib/helpers');
const WEBHOOK_JUSPAY_STATUS = ['CHARGED'];
const router = require('express').Router();

router.use('/', (req, res, next) => {
	if(req.session.transaction){
		return next();
	}
	res.redirect('/404');
});

router.get('/details', (req, res) => {
	res.json({
		transaction: req.session.transaction.doc,
		institute: {
			name: req.session.institute.doc.name,
		}
	});
});

router.get('/status', async (req, res) => {
	const doc = req.session.transaction?.doc;
	if(doc){
		const transaction = new Transaction();
		return res.json({
			status: (await transaction.findById({
				id: doc.id,
				instituteId: doc.instituteId,
				refId: doc.refId,
			})).Item?.status,
		});
	}
	res.redirect('/404');
});

router.post('/juspay_callback', async (req, res) => {
	// if(!req.session.transaction.pgRedirect){
	// 	return res.redirect('/404');
	// }
	if(req.session.transaction.doc.pgOrderId !== req.body.order_id){
		return res.redirect('/404');
	}

	// Now, proceed with processing the transaction status
	const doc = {
		...req.session.transaction.doc,
		pgCallback: req.body,
	};
	doc.status = await checkAndUpdateTrn({
		trn: doc,
		redirect: false,
	});
	req.session.transaction.doc = doc;
	req.session.save();
	res.redirect('/transaction/status');
	// await transaction.save(doc);
	// await updateTransactionStatus(doc, doc.status, doc.pgCallback, false);
	// req.session.transaction.pgRedirect = false;
});

router.post('/juspay_status_webhook', async (req, res) => {
	if(req.body?.content?.order?.id && WEBHOOK_JUSPAY_STATUS.indexOf(req.body?.content?.order?.status) > -1){
		const tnx = await (new Transaction().find({
			noPage: true,
			FilterExpression: 'pgInitiationDetails.id = :v',
			ExpressionAttributeValues: {':v': req.body.content.order.id}
		}))?.Items?.[0];
		if(tnx && ['success', 'failure'].indexOf(tnx.status) === -1){
			await checkAndUpdateTrn({
				trn: tnx,
				redirect: false,
			});
			// await updateTransactionStatus(tnx, statusTranslate(req.body.content.order.status), req.body.content, true);
		}
	}
	res.send('OK');
});

router.get('/juspay_initiate_transaction', async (req, res) => {
	const { id: transactionId, status, amount, userId, userName } = req.session.transaction.doc;

	// If the transaction has gone past the "initiated" phase,
	// 	then we musn't generate a new one
	if (status !== 'initiated') {
		return res.redirect('/404');
	}

	const doc = {
		...req.session.transaction.doc,
		pgOrderId: getPGOrderId(req.session.institute.doc.shortId, transactionId),
	};
	try{
		doc.pgInitiationDetails =  await generateTransactionSession({
			transactionId: doc.pgOrderId,
			amount,
			userId,
			userName,
		});
	} catch(err){
		return res.send(err);
	}
	const transaction = new Transaction();
	await transaction.save(doc);
	req.session.transaction.doc = doc;
	// req.session.transaction.pgRedirect = true;
	req.session.save();
	res.json({transactionURL: doc.pgInitiationDetails.payment_links?.web || null});
});

function getPGOrderId(instituteShortId, transactionId){
	return `${instituteShortId}-${transactionId.substring(22)}`;
}

router.post('/user_details', async (req, res) => {
	const requestBody = req.body;
	if(transactionUserDetailsValidation(requestBody)){
		const transaction = new Transaction();
		const doc = {
			...req.session.transaction.doc,
			...requestBody,
		};
		console.log(doc);
		try{
			await transaction.save(doc);
			req.session.transaction.doc = doc;
		} catch(err){
			console.error(JSON.stringify(err));
			return res.status(404).json({
				error: 'Retry on same session not allowed!'
			});
		}
		switch(transaction.getDocumentType(doc.documentType)){
		case 'PAN': {
			const ckycResponse = await performCKYC({
				reference_id: doc.id,
				document_type: 'PAN',
				id_number: doc.documentId,
				consent_purpose: PURPOSE,
			});
			if(ckycResponse.status === 'FAILURE'){
				return res.status(400).json(ckycResponse.data);
			}
			doc.ckycDetails = ckycResponse.data.kycResult;
			transaction.save(doc);
			return res.json(doc.ckycDetails);
		}
		case 'AADHAAR':{
			const aadhaarCaptcha = await validateAadhaarDetailsGenerateCaptcha({
				reference_id: doc.id,
				purpose: PURPOSE,
			});
			if(aadhaarCaptcha.status === 'FAILURE'){
				console.log(aadhaarCaptcha);
				return res.status(400).json(aadhaarCaptcha);
			}
			req.session.decentro = {
				initiationId: aadhaarCaptcha.decentroTxnId
			};
			return res.json({
				captchaImage: aadhaarCaptcha.data.captchaImage
			});
		}
		default:{
			res.status(400).json({
				error: 'Document Type unknown.'
			});
		}
		}
		return;
	}
	res.status(400).json({
		error: 'Mismatching or wrong parameters sent'
	});
});

router.get('/regenerate_captcha', async (req, res) => {
	const decentro = req.session.decentro;
	if(decentro && decentro.initiationId){
		const recaptcha = await validateAadhaarDetailsRecaptcha({
			reference_id: req.session.transaction.doc.id,
			purpose: PURPOSE,
			initiation_transaction_id: decentro.initiationId,
		});
		if(recaptcha.status === 'FAILURE'){
			return res.status(400).json(recaptcha);
		}
		res.json(recaptcha.data);
	}
});

router.post('/generate_otp', async (req, res) => {
	const decentro = req.session.decentro;
	if(decentro && decentro.initiationId){
		const doc = req.session.transaction.doc;
		const generateOtp = await validateAadhaarDetailsGenerateOTP({
			reference_id: doc.id,
			purpose: PURPOSE,
			aadhaar_number: doc.documentId,
			captcha: req.body.captcha,
			initiation_transaction_id: decentro.initiationId,
		});
		if(generateOtp.status === 'FAILURE'){
			return res.status(400).json(generateOtp);
		}
		res.json(generateOtp);
	}
});

function generateIdNumberFormatAadhaarKyc({
	id,
	fullName,
	dob,
	gender,
}){
	return `${ id.substr(-4) }|${ fullName }|${ dob }|${ gender }`;
}

router.post('/validate_otp', async (req, res) => {
	const decentro = req.session.decentro;
	if(decentro && decentro.initiationId){
		const doc = req.session.transaction.doc;
		const validateOtp = await validateAadhaarDetailsValidateOTP({
			reference_id: doc.id,
			purpose: PURPOSE,
			otp: req.body.otp,
			initiation_transaction_id: decentro.initiationId,
		});
		if(validateOtp.status === 'FAILURE'){
			return res.status(400).json(validateOtp);
		}
		const { proofOfIdentity } = doc.aadhaarDetails = req.session.decentro.userDetails = validateOtp.data;
		const transaction = new Transaction();
		const ckycResponse = await performCKYC({
			reference_id: doc.id,
			document_type: 'AADHAAR',
			id_number: generateIdNumberFormatAadhaarKyc({
				id: doc.documentId,
				fullName: proofOfIdentity.name,
				dob: proofOfIdentity.dob,
				gender: proofOfIdentity.gender,
			}),
			consent_purpose: PURPOSE,
		});
		if(ckycResponse.status === 'FAILURE'){
			return res.status(400).json(ckycResponse.data);
		}
		doc.ckycDetails = ckycResponse.data.kycResult;
		try{
			await transaction.save(doc);
			req.session.transaction.doc = doc;
		} catch(err){
			console.error(JSON.stringify(err));
			return res.status(404).json({
				error: 'Retry on same session not allowed!'
			});
		}
		return res.json({
			ckycDetails: doc.ckycDetails,
			aadhaarDetails: doc.aadhaarDetails,
		});
	}
});

router.get('/credit_report', async (req, res) => {
	const decentro = req.session.decentro;
	const doc = req.session.transaction.doc;
	const transaction = new Transaction();
	console.log(doc);
	const creditReport = await generateCreditReport(
		((decentro && decentro.userDetails) ? {
			reference_id: doc.id + new Date().getTime(),
			name: doc.aadhaarDetails.proofOfIdentity.name,
			date_of_birth: decentro.userDetails.proofOfIdentity.dob.split('-').reverse().join('-'),
			pincode: decentro.userDetails.proofOfAddress.pincode,
			mobile: doc.userMobile,
			inquiry_purpose: 'PL',
			document_type: 'AADHAAR',
			document_id: doc.documentId,
		} : {
			reference_id: doc.id,
			name: doc.ckycDetails.fullName,
			mobile: doc.userMobile,
			inquiry_purpose: 'PL',
			document_type: 'PAN',
			document_id: doc.documentId,
		}));
	if(creditReport.status === 'FAILURE'){
		return res.status(400).json(creditReport);
	}
	doc.creditReport = creditReport.data.CCRResponse.CIRReportDataLst[0].CIRReportData;
	await transaction.save(doc);
	req.session.creditReport = doc.creditReport;
	res.json(doc.creditReport);
});

module.exports = router;
