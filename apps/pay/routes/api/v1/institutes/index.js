const router = require('express').Router();
const Institute = require('@models/institute');
const Transaction = require('@models/transaction');
const { transactionRequestValidation,
	transactionDetailsValidation } = require('./validations');
const { jwtSign } = require('@lib/authentication');
const { registerTransactionEvent } = require('@lib/helpers');
const { getFilterQuery } = require('@lib/helpers/transactionQuery');

async function generateTransactionUrl({protocol, hostname, id, instituteId, refId }){
	return `${ protocol }://${ hostname }/transaction/init?request=${ await jwtSign({ id, instituteId, refId }) }`;
}

async function authenticateInstitute(req, res, next){
	const institute = new Institute();
	const instituteId = req.params.instituteId;
	const doc = await institute.findById(instituteId);
	if(doc.Item){
		if(!(await institute.verifyAPICredentials(doc.Item, req.headers['x-authorization']))){
			return res.status(400).json({
				error: 'Authorization failed'
			});
		}
		req.institute = doc.Item;
		return next();
	}
	res.status(404).json({
		error: 'Resource not found'
	});
}

router.post('/:instituteId/create_transaction', authenticateInstitute, async (req, res) => {
	const transactionBody = req.body;
	transactionBody.instituteId = req.params.instituteId;
	transactionBody.status = 'new';
	if(!transactionRequestValidation(transactionBody)){
		return res.status(400).json({
			error: 'There seems to be some parameters missing or mismatching types'
		});
	}
	try {
		const transaction = new Transaction();
		if(await transaction.create(transactionBody)){
			res.json({
				doc: transaction.doc,
				redirectUrl: await generateTransactionUrl({
					...transaction.doc,
					protocol: req.protocol,
					hostname: req.get('host'),
				})
			});
			return registerTransactionEvent({
				trnId: transaction.doc.id,
				type: 'created',
				context: transaction.doc,
			});
		}
		return res.status(400).json({
			doc: transaction.doc,
			error: 'Record could not be created'
		});
	} catch(error){
		return res.status(400).json({
			error
		});
	}
});

router.get('/:instituteId/transactions', authenticateInstitute, async(req, res) => {
	const trn = new Transaction();
	let pageKey = req.query.page;
	if (typeof pageKey === 'string'){
		try {
			pageKey = JSON.parse(Buffer.from(pageKey, 'base64').toString());
		}
		catch ( e ) {
			res.status(401).json({error: 'Wrong page parameter'});
			console.error(e);
		}
	}

	const query = getFilterQuery({
		instituteId: req.params.instituteId,
		fromDate: req.query[ 'dateRange.start' ] || req.query.fromDate,
		toDate: req.query[ 'dateRange.end' ] || req.query.toDate,
		status: req.query.status,
		limit: 100,
		nextPage: pageKey,
		asc: req.query.asc ? true : false,
	});
	query.ProjectionExpression = 'id, refUniqueId, refId, userId, userName, userDetails, instituteId, currency, amount, userMobile, userEmail, #s, createdAt, updatedAt';
	if(!query.ExpressionAttributeNames){
		query.ExpressionAttributeNames = {};
	}
	query.ExpressionAttributeNames['#s'] = 'status';
	const { Items, LastEvaluatedKey } = await trn.list(query);
	res.json({
		Items,
		page: LastEvaluatedKey ?
			Buffer.from(JSON.stringify(LastEvaluatedKey)).toString('base64') :
			undefined,
	});
});

function generateResponse({status, refUniqueId, refId, id, userId, amount, expiresOn }){
	return {
		status,
		refUniqueId,
		refId,
		id,
		userId,
		amount,
		expiresOn
	};
}

router.get('/:instituteId/get_transaction_details', authenticateInstitute, async (req, res) => {
	const instituteId = req.params.instituteId;
	const { transactionId, refId } = req.query;
	if(transactionDetailsValidation({ instituteId, transactionId, refId })){
		const transaction = new Transaction();
		await transaction.findById({
			id: transactionId,
			instituteId,
			refId,
		});
		if(transaction.doc.Item){
			return res.json(generateResponse(transaction.doc.Item));
		}
	}
	res.status(404).json({
		error: 'Resource not found'
	});
});

router.get('/:instituteId/regenerate_api_credentials', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		res.json(await institute.regenerateAPICredentials(doc.Item));
	} else {
		res.status(404).json({
			error: 'Resource not found'
		});
	}
});

router.post('/:instituteId/extend_license', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		doc.Item.expiresOn = new Date(req.body.expires).toISOString();
		res.json(await institute.regenerateAPICredentials(doc.Item));
	} else {
		res.status(404).json({
			error: 'Resource not found'
		});
	}
});

router.get('/', async (req, res) => {
	const institutes = new Institute();
	res.json(await institutes.list());
});

router.post('/', async (req, res) => {
	const institute = new Institute();
	req.body.shortId = Math.floor(new Date().getTime() / 1000);
	res.json(await institute.create(req.body));
});

router.get('/:instituteId/', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		res.json(doc.Item);
	} else {
		res.status(404).json({
			error: 'Resource not found'
		});
	}
});

router.put('/:instituteId/', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		res.json(await institute.save({...doc.Item, ...req.body }));
	} else {
		res.status(404).json({
			error: 'Resource not found',
		});
	}
});

router.delete('/:instituteId/', async (req, res) => {
	const institute = new Institute();
	res.json(await institute.delete(req.params.instituteId));
});

module.exports = router;
