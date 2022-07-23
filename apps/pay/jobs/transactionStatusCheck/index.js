const Transaction = require('../../models/transaction');
const { checkAndUpdateTrn } = require('../../lib/helpers');
const transaction = new Transaction();

async function main(){
	const trns = (await transaction.find({
		noPage: true,
		FilterExpression: '#e < :t AND (NOT #s IN (:s1, :s2)) AND attribute_exists(#p) ',
		ExpressionAttributeNames: {'#e': 'expiresOn', '#s': 'status', '#p': 'pgInitiationDetails'},
		ExpressionAttributeValues: {
			':t': new Date().getTime(),
			':s1': 'success',
			':s2': 'failed'}
	}))?.Items || [];
	if(trns.length > 0){
		console.log('Transaction IDs:');
		for(const trn of trns){
			console.log(trn.id);
			await checkAndUpdateTrn({
				trn,
				redirect: true,
				allowFailed: true,
			});
		}
		console.log(`Total records pulled: ${ trns.length }`);
	}
}

main();
