const { Parser } = require('@json2csv/plainjs');
const Transaction = require('@models/transaction');
const TransactionEvent = require('@models/transactionEvent');
// const {transactionUserDetailsValidation} = require('./validations');
const router = require('express').Router();
const parserWithHeader = new Parser(getParserOptions());
const parserWithoutHeader = new Parser({
	...getParserOptions(),
	header: false,
});
const { getFilterQuery } = require('@lib/helpers/transactionQuery');

router.get('/list', async (req, res) => {
	const trn = new Transaction();
	let pageKey = req.query.page;
	if (typeof pageKey === 'string'){
		try {
			pageKey = JSON.parse( pageKey );
		}
		catch ( e ) {
			console.error(e);
		}
	}

	const query = getFilterQuery({
		instituteId: req.session?.user?.instituteId || req.query?.instituteId,
		fromDate: req.query[ 'dateRange.start' ],
		toDate: req.query[ 'dateRange.end' ],
		status: req.query.status,
		limit: req.query.limit,
		nextPage: pageKey,
		asc: req.query.asc ? true : false,
	});

	if (!req.query?.export) {
		res.json(await trn.list(query));
		return;
	}

	query.withPage = true;
	query.limit = query.limit || 2000;
	res.setHeader('Content-Type', 'text/csv');
	res.setHeader('Content-Disposition', 'attachment;filename=payments_export.csv');
	let headersDone = false;
	let hasMoreEntries = true;
	do{
		const { Items, LastEvaluatedKey } = (await trn.list(query));
		res.write(
			(headersDone ? parserWithoutHeader : parserWithHeader)
				.parse(Items) + '\n');
		headersDone = true;
		hasMoreEntries = LastEvaluatedKey ? true : false;
		query.next = LastEvaluatedKey;
	} while(hasMoreEntries);
	res.end();
});

router.get('/query', async (req, res) => {
	const trn = new Transaction();

	res.json(await trn.find({
		IndexName: 'instituteId-userId-index',
		KeyConditionExpression: '#iid = :iid AND #uid = :uid',
		ExpressionAttributeNames: {
			'#iid': 'instituteId',
			'#uid': 'userId',
		},
		ExpressionAttributeValues: {
			':iid': req.session?.user?.instituteId || req.query?.instituteId,
			':uid': req.query.s,
		},
	}));
});

router.get('/:transactionId/', async (req, res) => {
	const transaction = new Transaction();
	const doc = (await transaction.findById({
		id: req.params.transactionId,
	})).Item;
	if(req.session.user?.instituteId !== doc.instituteId){
		return res.status(404).send('Not Found');
	}
	return res.json(doc);
});

router.get('/:transactionId/events', async (req, res) => {
	const transaction = new Transaction();
	const transactionEvent = new TransactionEvent();
	const doc = (await transaction.findById({
		id: req.params.transactionId,
		instituteId: req.query.instituteId,
		refId: req.query.refId,
	})).Item;
	if(req.session.user?.instituteId !== doc.instituteId){
		return res.status(404).send('Not Found');
	}
	res.json((await transactionEvent.query({
		KeyConditionExpression: '#id = :idval',
		ExpressionAttributeNames:{
			'#id': 'id',
		},
		ExpressionAttributeValues: {
			':idval': req.params.transactionId,
		},
	})).Items);
});

function getParserOptions(){
	return {
		fields: [
			{
				label: 'Initiated At',
				value: 'createdAt',
			},
			{
				label: 'Name',
				value: 'userName',
			},
			{
				label: 'Student Id',
				value: 'userId',
			},
			{
				label: 'Status',
				value: 'status',
			},
			{
				label: 'PG Order Id',
				value: 'pgOrderId',
			},
			{
				label: 'Amount',
				value: 'amount',
			},
			{
				label: 'Updated At',
				value: 'updatedAt',
			},
			{
				label: 'Reference Id',
				value: 'refId',
			},
		]
	};
}

module.exports = router;
