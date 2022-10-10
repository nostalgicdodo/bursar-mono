const { parse } = require('json2csv');
const Transaction = require('@models/transaction');
// const {transactionUserDetailsValidation} = require('./validations');
const router = require('express').Router();

router.get('/list', async (req, res) => {
	const trn = new Transaction();
	let pageKey = req.query.page;
	if (typeof pageKey === "string"){
		try {
			pageKey = JSON.parse( pageKey )
		}
		catch ( e ) {}
	}

	const query = getFilterQuery({
		instituteId: req.session?.user?.instituteId || req.query?.instituteId,
		fromDate: req.query[ "dateRange.start" ],
		toDate: req.query[ "dateRange.end" ],
		status: req.query.status,
		limit: req.query.limit,
		nextPage: pageKey,
		asc: req.query.asc ? true : false,
	})

	if (!req.query?.export) {
		res.json(await trn.list(query));
		return;
	}

	delete query.withPage;
	query.noPage = true;
	query.limit = query.limit || 2000;
	res.setHeader('Content-Type', 'text/csv');
	res.setHeader('Content-Disposition', 'attachment;filename=payments_export.csv');
	res.send(getExportCSV((await trn.list(query)).Items));
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
		return res.json('/404');
	}
	return res.json(doc);
});

function getFilterQuery({
	instituteId,
	fromDate,
	toDate,
	status,
	limit,
	nextPage,
	asc = false,
}){
	const query = {
		ExpressionAttributeNames: {},
		ExpressionAttributeValues: {},
		ScanIndexForward: asc,
		limit,
		next: nextPage,
		withPage: true,
	};
	if(instituteId){
		query.IndexName = 'instituteId-createdAt-index';
		query.KeyConditionExpression = '#iid = :iid';
		query.ExpressionAttributeNames['#iid'] = 'instituteId';
		query.ExpressionAttributeValues[':iid'] = instituteId;
	} else {
		delete query.ExpressionAttributeNames;
		delete query.ExpressionAttributeValues;
		return query;
	}
	if(fromDate && toDate){
		query.KeyConditionExpression += ' AND #cr BETWEEN :fd AND :td';
		query.ExpressionAttributeNames['#cr'] = 'createdAt';
		query.ExpressionAttributeValues[':fd'] = fromDate;
		query.ExpressionAttributeValues[':td'] = toDate;
	} else {
		if(fromDate){
			query.KeyConditionExpression += ' AND #cr >= :fd';
			query.ExpressionAttributeNames['#cr'] = 'createdAt';
			query.ExpressionAttributeValues[':fd'] = fromDate;
		}
		if(toDate){
			query.KeyConditionExpression += ' AND #cr <= :td';
			query.ExpressionAttributeNames['#cr'] = 'createdAt';
			query.ExpressionAttributeValues[':td'] = toDate;
		}
	}
	if(status){
		query.ExpressionAttributeNames['#s'] = 'status';
		if ( status === "unresolved" ) {
			query.FilterExpression = 'NOT #s IN (:stval1, :stval2)';
			query.ExpressionAttributeValues[':stval1'] = 'success';
			query.ExpressionAttributeValues[':stval2'] = 'failed';
		}
		else {
			const statuses = status.split(',');
			const exp = [];
			for(const i in statuses){
				exp.push(`:s${ i }`);
				query.ExpressionAttributeValues[`:s${ i }`] = statuses[i];
			}
			query.FilterExpression = `#s IN ( ${ exp.join(',') } )`;
		}
	}
	return query;
}

function getExportCSV(json){
	return parse(json, {
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
	});
}

module.exports = router;
