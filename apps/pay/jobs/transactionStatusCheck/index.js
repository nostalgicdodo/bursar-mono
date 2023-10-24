const Transaction = require('@models/transaction');
const { checkAndUpdateTrn } = require('@lib/helpers');
const transaction = new Transaction();

async function main(){
	const trns = (await transaction.find({
		noPage: true,
		IndexName: 'cron-query-index',
		KeyConditionExpression: '#s = :s3 AND #e < :t',
		FilterExpression: 'attribute_exists(#p)',
		ExpressionAttributeNames: {'#e': 'expiresOn', '#s': 'status', '#p': 'pgInitiationDetails'},
		ExpressionAttributeValues: {
			':t': new Date().getTime(),
			':s3': 'initiated',
		},
	}))?.Items || [];
	if(trns.length > 0){
		// console.log('Transaction IDs:');
		for(const trn of trns){
			console.log(trn.id);
			await checkAndUpdateTrn({
				trn,
				redirect: true,
				allowFailed: true,
				from: 'cron',
			});
		}
		// console.log(`Total records pulled: ${ trns.length }`);
	}
}

main();
