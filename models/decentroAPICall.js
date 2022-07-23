const DbHandler = require('@lib/dbHandler');

const Schema = {
	TableName : 'DecentroAPICall',
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
			ReadCapacityUnits: 1,
			WriteCapacityUnits: 10
		}
	},
	Fields: {
		time: DbHandler.types.isDateString(),
		operation: DbHandler.types.isString(),
		requestBody: DbHandler.types.isObject(),
		responseBody: DbHandler.types.isObject(),
	}
};

class DecentroAPICall extends DbHandler{

	constructor(){
		super(Schema);
	}

}

module.exports = DecentroAPICall;
