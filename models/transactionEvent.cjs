const DbHandler = require('@lib/dbHandler/index.cjs');

const Schema = {
	TableName : 'TransactionEvent',
	KeyInfo: {
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH'},
			{ AttributeName: 'time', KeyType: 'RANGE'},
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
			{ AttributeName: 'time', AttributeType: 'S'},
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10,
		}
	},
	Fields: {
		time: DbHandler.types.isDateString(),
		type: DbHandler.types.isString(),
		context: DbHandler.types.isObject(),
	}
};

class TransactionEvent extends DbHandler{

	constructor(){
		super(Schema);
	}

}

module.exports = TransactionEvent;
