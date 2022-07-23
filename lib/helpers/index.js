const request = require('request');
const Transaction = require('@models/transaction');
const { getTransactionStatus } = require('../juspay');

async function updateTransactionStatus({
	doc,
	status,
	pgCallback,
	callbackToInstitute = true,
	allowFailed = false,
}){
	if(doc.status === status || (status === 'failed' && !allowFailed)){
		return status;
	}
	const transaction = new Transaction();
	try {
		await transaction.update({
			Key: {
				id: doc.id,
				refUniqueId: doc.refUniqueId
			},
			UpdateExpression: 'SET #a = :s, #b = :o, #c = :u',
			ConditionExpression: 'NOT #a IN (:v1, :v2)',
			ExpressionAttributeNames: {
				'#a': 'status',
				'#b': 'pgCallback',
				'#c': 'updatedAt',
			},
			ExpressionAttributeValues: {
				':s': status,
				':o': pgCallback,
				':v1': 'success',
				':v2': 'failed',
				':u': new Date().toISOString(),
			}
		});
		if(callbackToInstitute && ['success', 'failed'].indexOf(status) > -1){
			request({
				method: 'POST',
				url: status === 'success' ? doc.successRedirect : doc.failureRedirect,
				headers: {
					'content-type': 'multipart/form-data'
				},
				formData: {
					status: status,
					refUniqueId: doc.refUniqueId,
					refId: doc.refId,
					id: doc.id,
					userId: doc.userId,
					amount: doc.amount,
					expiresOn: doc.expiresOn,
				}
			}, function (error, _response, body) {
				console.log(error, body);
			});
		}
		return status;
	} catch(err){
		console.error(err);
	}
}

async function checkAndUpdateTrn({
	trn,
	redirect = true,
	allowFailed = false,
}){
	if(trn?.pgInitiationDetails?.id && trn.pgOrderId){
		try {
			const pgCallback = await getTransactionStatus({
				transactionId: trn.pgOrderId
			});
			return await updateTransactionStatus({
				doc: trn,
				status: statusTranslate(pgCallback?.status),
				pgCallback,
				callbackToInstitute: redirect,
				allowFailed,
			});
		} catch(err){
			console.error(err);
		}
	}
}

function statusTranslate(pgstatus){
	return (pgstatus === 'CHARGED') ? 'success' : 'failed';
}

module.exports = {
	updateTransactionStatus,
	statusTranslate,
	checkAndUpdateTrn,
};