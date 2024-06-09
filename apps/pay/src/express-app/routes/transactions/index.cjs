const router = require('express').Router();
const Institute = require('@models/institute.cjs');
const Transaction = require('@models/transaction.cjs');
const { jwtVerify } = require('@lib/authentication/index.cjs');
const { registerTransactionEvent } = require('@lib/helpers/index.cjs');

function forceRegenerateSession(req){
	return new Promise(resolve => {
		req.session.regenerate(() => {
			resolve();
		});
	});
}

router.get('/init', async (req, res) => {
	let token;
	try {
		token = await jwtVerify(req.query.request);
	} catch(err){
		console.error(err);
		return res.redirect('/404');
	}

	const transaction = new Transaction();
	const { id: transactionId, instituteId, refId } = token;
	if(req.session.transaction?.transactionId !== transactionId){
		await forceRegenerateSession(req);
	}
	if((await transaction.findById({
		id: transactionId,
		instituteId,
		refId,
	})).Item && transaction.doc.Item.status === 'new'){
		const institute = new Institute();
		transaction.doc.Item.status = 'initiated';
		await transaction.save(transaction.doc.Item);
		req.session.transaction = {
			transactionId,
			instituteId,
			refId,
			doc: transaction.doc.Item,
		};

		req.session.institute = {
			instituteId,
			doc: (await institute.findById(instituteId)).Item,
		};

		delete req.session.institute.doc.logoImage;

		if (req.session.transaction.doc.type === 0) {
			res.redirect('/order/kmat/checkout');
			return registerTransactionEvent({
				trnId: transactionId,
				type: 'session-created',
				context: transaction.doc.Item,
			});
		}
	}
	res.redirect('/404');
});



module.exports = router;
