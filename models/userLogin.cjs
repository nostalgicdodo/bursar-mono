const DbHandler = require('@lib/dbHandler/index.cjs');

const Schema = {
	TableName : 'UserLogin',
	KeyInfo: {
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH'},
			{ AttributeName: 'datetime', KeyType: 'RANGE'},
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
			{ AttributeName: 'datetime', AttributeType: 'S' },
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10,
		}
	},
	Fields: {
		datetime: DbHandler.types.isDateString(),
		ip: DbHandler.types.isString(),
		device: DbHandler.types.isString(),
		success: DbHandler.types.isBool(),
	}
};

class UserLogin extends DbHandler{

	constructor(){
		super(Schema);
	}

}

module.exports = UserLogin;
