const DbHandler = require('@lib/dbHandler');
const { compareWithHash, encryptWithHash } = require('@lib/authentication');

const Schema = {
	TableName : 'User',
	KeyInfo: {
		KeySchema: [
			{ AttributeName: 'id', KeyType: 'HASH'},
		],
		AttributeDefinitions: [
			{ AttributeName: 'id', AttributeType: 'S' },
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10,
		}
	},
	Fields: {
		name: DbHandler.types.isString(),
		role: DbHandler.types.isString(),
		instituteId: DbHandler.types.isString(),
		email: DbHandler.types.isString(),
		mobile: DbHandler.types.isString(),
		password: DbHandler.types.isString(),
		resetPassword: DbHandler.types.isBool(),
	}
};

class User extends DbHandler{

	constructor(){
		super(Schema);
		this.doc = {};
	}

	async findById(id){
		this.doc = await super.findById(id);
		return this.doc.Item;
	}

	async create(doc){
		doc.password = await this.encrypt(doc.password);
		doc.resetPassword = true;
		doc.id = doc.email.toLowerCase();
		return super.create(doc);
	}

	async encrypt(password){
		return await encryptWithHash(password);
	}

	async save(doc){
		doc.password = await this.encrypt(doc.password);
		return super.save(doc);
	}

	async authenticate(userId, password){
		const user = await this.findById(userId);
		if (!user?.email) {
			return false;
		}
		return (await compareWithHash(password, user.password));
	}

}

module.exports = User;
