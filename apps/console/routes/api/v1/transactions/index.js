const Transaction = require('@models/transaction');
// const {transactionUserDetailsValidation} = require('./validations');
const router = require('express').Router();

router.get('/list', async (req, res) => {
	const trn = new Transaction();
	let query = {
		FilterExpression: ['#id > :idval'],
		ExpressionAttributeNames: {'#id': 'id',},
		ExpressionAttributeValues: {':idval': '0',},
	};
	const instituteId = req.session?.user?.instituteId || req.query?.instituteId;
	const fromDate = req.query.fromDate;
	const toDate = req.query.toDate;
	const status = req.query.status;
	const nextPage = req.query.next;
	if(instituteId){
		query.FilterExpression.push('#ruid > :ruidval');
		query.ExpressionAttributeNames = {
			...query.ExpressionAttributeNames,
			'#ruid': 'refUniqueId',
		};
		query.ExpressionAttributeValues = {
			...query.ExpressionAttributeValues,
			':ruidval': instituteId,
		};
	}
	if(fromDate){
		query.FilterExpression.push('#cr >= :fromDate');
		query.ExpressionAttributeNames = {
			...query.ExpressionAttributeNames,
			'#cr': 'createdAt',
		};
		query.ExpressionAttributeValues = {
			...query.ExpressionAttributeValues,
			':fromDate': fromDate,
		};
	}
	if(toDate){
		query.FilterExpression.push('#cr <= :toDate');
		query.ExpressionAttributeNames = {
			...query.ExpressionAttributeNames,
			'#cr': 'createdAt',
		};
		query.ExpressionAttributeValues = {
			...query.ExpressionAttributeValues,
			':toDate': toDate,
		};
	}
	if(status){
		query.FilterExpression.push('#st <= :stval');
		query.ExpressionAttributeNames = {
			...query.ExpressionAttributeNames,
			'#st': 'status',
		};
		query.ExpressionAttributeValues = {
			...query.ExpressionAttributeValues,
			':stval': status,
		};
	}
	if(query.FilterExpression.length > 0){
		query.FilterExpression = query.FilterExpression.join(' AND ');
	} else {
		query = {};
	}
	query.limit = req.query.limit;
	query.next = nextPage;
	res.json(await trn.list(query));
});

router.get('/:transactionId/', async (req, res) => {
	if(req.session.user){
		const transaction = new Transaction();
		const doc = (await transaction.findById({
			id: req.params.transactionId,
		})).Item;
		if(req.session.user?.instituteId !== doc.instituteId){
			return res.json('/404');
		}
		return res.json(doc);
	}
	res.redirect('/404');
});

module.exports = router;
