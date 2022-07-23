const DbHandler = require('@lib/dbHandler');
const { v4: uuid } = require('uuid');
const { jwtSign, jwtVerify } = require('@lib/authentication');

const Schema = {
	TableName : 'Institute',
	KeyInfo: {
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH'},
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	},
	Fields: {
		name: DbHandler.types.isString(),
		expiresOn: DbHandler.types.isDateString(),
		owner: DbHandler.types.isString(),
		location: DbHandler.types.isString(),
		pincode: DbHandler.types.isString(),
		apiUser: DbHandler.types.isString(),
		apiPassword: DbHandler.types.isString(),
		shortId: DbHandler.types.isNumber(),
		logoImage: DbHandler.types.isString(),
	}
};

class Institute extends DbHandler{

	constructor(){
		super(Schema);
	}

	async generateApiCredentials(expiresOn){
		const apiUser = uuid();
		const apiPassword = uuid();
		const token = await jwtSign({
			apiUser,
			apiPassword,
		}, {
			expiresIn: (new Date(expiresOn).getTime() - new Date().getTime())
		});
		return {
			apiUser,
			apiPassword,
			token,
		};
	}

	async create(doc){
		const apiCreds = await this.generateApiCredentials(doc.expiresOn);
		doc.apiUser = apiCreds.apiUser;
		doc.apiPassword = apiCreds.apiPassword;
		const newDoc = await super.create(doc);
		newDoc.apiCreds = apiCreds;
		return newDoc;
	}

	async regenerateAPICredentials(doc){
		const apiCreds = await this.generateApiCredentials(doc.expiresOn);
		doc.apiUser = apiCreds.apiUser;
		doc.apiPassword = apiCreds.apiPassword;
		const newDoc = await this.save(doc);
		newDoc.apiCreds = apiCreds;
		return newDoc;
	}

	async verifyAPICredentials(doc, token){
		try{
			const apiCreds = await jwtVerify(token);
			if(apiCreds.apiUser &&
				apiCreds.apiPassword &&
				doc.apiUser === apiCreds.apiUser &&
				doc.apiPassword === apiCreds.apiPassword){
				return true;
			}
		} catch(err){
			console.error(JSON.stringify(err));
			return false;
		}
		return false;
	}

}

module.exports = Institute;
