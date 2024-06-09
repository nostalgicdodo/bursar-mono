const DynamoDBHandler = require('./dynamoDBHandler/index.cjs');
const VALUE_TYPE_CHECK_INGNORED_FIELDS = ['id', '_rev', 'createdAt', 'updatedAt'];

class DbHandler extends DynamoDBHandler{

	constructor(schema){
		super();
		this.schema = {
			TableName: schema.TableName,
			...schema.KeyInfo
		};
		this.table = schema.TableName;
		this.Fields = schema.Fields;
	}

	updateParameters(params){
		params.TableName = this.table;
		return params;
	}

	async createTable(){
		return super.createTable(this.schema);
	}

	async deleteTable(){
		return super.deleteTable(this.updateParameters({}));
	}

	async create(doc){
		if(doc._rev){
			return false;
		}
		return this.insert(doc);
	}

	async insert(doc){
		for(const field of Object.keys(doc)){
			if(VALUE_TYPE_CHECK_INGNORED_FIELDS.indexOf(field) === -1){
				if(!(this.Fields[field] && this.checkType(doc[field], this.Fields[field]))){
					throw Error(`Missing field '${ field }' from schema or type mismatch`);
				}
			}
		}
		if(!doc.createdAt){
			doc.updatedAt = doc.createdAt = new Date().toISOString();
		} else {
			doc.updatedAt = new Date().toISOString();
		}
		return super.insert(this.updateParameters({
			Item: doc
		}));
	}

	async save(doc){
		return this.insert(doc);
	}

	async findById(id){
		return super.findById(this.updateParameters({Key: this.getKeyQuery(id)}));
	}

	getKeyQuery(id){
		return (typeof id === 'object') ? id : { id };
	}

	async find(params){
		return super.find(this.updateParameters(params));
	}

	async update(params){
		return super.update(this.updateParameters(params));
	}

	async delete(id){
		return super.delete(this.updateParameters({Key: this.getKeyQuery(id)}));
	}

	async list(params = {}){
		return super.list(this.updateParameters(params));
	}

	async query(params){
		return super.query(this.updateParameters(params));
	}

	checkType(val, type){
		if(!val){
			return true;
		}
		if(typeof val === type){
			return true;
		}
		if(type === 'array' && Array.isArray(val)){
			return true;
		}
		if(type === 'datestring' && (new Date(val).toISOString() === val)){
			return true;
		}
		return false;
	}

}

DbHandler.types = {
	isString(){
		return 'string';
	},
	isNumber(){
		return 'number';
	},
	isBool(){
		return 'boolean';
	},
	isObject(){
		return 'object';
	},
	isArray(){
		return 'array';
	},
	isDateString(){
		return 'datestring';
	},
};

module.exports = DbHandler;
