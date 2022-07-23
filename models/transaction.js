const DbHandler = require('@lib/dbHandler');
const MAX_TRANSACTION_SESSION_DURATION = 1000 * 60 * 15; // 15 minutes
const Schema = {
	TableName : 'Transaction',
	KeyInfo: {
		KeySchema: [
			{ AttributeName: 'refUniqueId', KeyType: 'HASH'},
			{ AttributeName: 'id', KeyType: 'RANGE'},
		],
		AttributeDefinitions: [
			{ AttributeName: 'refUniqueId', AttributeType: 'S' },
			{ AttributeName: 'id', AttributeType: 'S' },
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 10,
			WriteCapacityUnits: 10
		}
	},
	Fields: {
		refUniqueId: DbHandler.types.isString(),
		refId: DbHandler.types.isString(),
		userId: DbHandler.types.isString(),
		userName: DbHandler.types.isString(),
		userDetails: DbHandler.types.isObject(),
		type: DbHandler.types.isString(),
		instituteId: DbHandler.types.isString(),
		expiresOn: DbHandler.types.isNumber(),
		currency: DbHandler.types.isString(),
		amount: DbHandler.types.isNumber(),
		lenderId: DbHandler.types.isString(),
		failureRedirect: DbHandler.types.isString(),
		successRedirect: DbHandler.types.isString(),
		documentType: DbHandler.types.isNumber(),
		documentId: DbHandler.types.isString(),
		userRelationType: DbHandler.types.isNumber(),
		userRelationOthers:  DbHandler.types.isString(),
		userMobile: DbHandler.types.isString(),
		userEmail: DbHandler.types.isString(),
		aadhaarDetails: DbHandler.types.isObject(),
		ckycDetails: DbHandler.types.isObject(),
		creditReport: DbHandler.types.isObject(),
		pgCallback: DbHandler.types.isObject(),
		pgInitiationDetails: DbHandler.types.isObject(),
		status: DbHandler.types.isString(),
		pgOrderId: DbHandler.types.isString(),
	}
};

const CURRENCY_VALUES = ['INR'];
const DOCUMENT_TYPES = ['', 'PAN', 'AADHAAR'];
const USER_RELATION_TYPES = ['self', 'mother', 'father', 'brother', 'sister', 'others'];
const TRANSACTION_TYPES = ['DT', 'LDT'];
// STATUS: ['new', 'initiated', 'success', 'failed'];

class Transaction extends DbHandler{

	constructor(){
		super(Schema);
		this.doc = {};
	}

	getDocumentType(index){
		return DOCUMENT_TYPES[index];
	}

	getUserRelationType(index){
		return USER_RELATION_TYPES[index];
	}

	getTransactionType(index){
		return TRANSACTION_TYPES[index];
	}

	getTransactionTypeIndex(val){
		return TRANSACTION_TYPES.indexOf(val);
	}

	async create(doc){
		doc.expiresOn = new Date().getTime() + MAX_TRANSACTION_SESSION_DURATION;
		doc.type = this.getTransactionTypeIndex(doc.type || '');
		if(doc.type === -1){
			throw new Error('Transaction type is not valid or missing');
		}
		this.doc = await super.create(this.preInsertion(doc));
		return this.doc;
	}

	preInsertion(doc){
		doc.refUniqueId = this.generateRefUniqueId(doc);
		doc.currency = CURRENCY_VALUES[0];
		return doc;
	}

	generateRefUniqueId({ instituteId, refId }){
		return `${ instituteId }-${ refId.toLowerCase() }`;
	}

	async save(doc){
		this.doc = { Item: await super.save(this.preInsertion(doc)) };
		return this.doc;
	}

	async findById({id, instituteId, refId}){
		this.doc = await super.findById({
			refUniqueId: this.generateRefUniqueId({ instituteId, refId }),
			id,
		});
		return this.doc;
	}

	async list({
		instituteId = false,
		limit = 15,
		next,
		FilterExpression,
		ExpressionAttributeNames,
		ExpressionAttributeValues,
	}){
		if(instituteId){
			return super.list({
				FilterExpression: '#ruid > :ruidval and #id > :idval',
				ExpressionAttributeNames:{
					'#ruid': 'refUniqueId',
					'#id': 'id',
				},
				ExpressionAttributeValues: {
					':ruidval': instituteId,
					':idval': '0',
				},
				Limit: limit,
				ExclusiveStartKey: next,
			});
		}
		return super.list({
			Limit: limit,
			ExclusiveStartKey: next,
			ExpressionAttributeNames,
			ExpressionAttributeValues,
			FilterExpression,
		});
	}

}

module.exports = Transaction;
