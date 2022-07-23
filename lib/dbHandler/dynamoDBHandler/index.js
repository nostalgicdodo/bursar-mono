const AWS = require('aws-sdk');
AWS.config.update({
	region: process.env.DB_REGION,
	endpoint: process.env.DB_ENDPOINT_URL,
});
const DynamoDB = new AWS.DynamoDB();
const DynamoDBClient = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');
const DEFAULT_ID_KEY_NAME = { AttributeName: 'id', KeyType: 'HASH'};
const DEFAULT_ID_KEY_TYPE = { AttributeName: 'id', AttributeType: 'S' };

class DynamoDBHandler {

	constructor(){
		this.DynamoDB = DynamoDB;
		this.DynamoDBClient = DynamoDBClient;
	}

	createTable(params){
		const _this = this;
		if(params.KeySchema){
			let idFound = false;
			for(const key of params.KeySchema){
				if(key.AttributeName === 'id'){
					idFound = true;
					break;
				}
			}
			if(!idFound){
				params.KeySchema.push(DEFAULT_ID_KEY_NAME);
				params.AttributeDefinitions.push(DEFAULT_ID_KEY_TYPE);
			}
		} else {
			params.KeySchema = [DEFAULT_ID_KEY_NAME];
			params.AttributeDefinitions = [DEFAULT_ID_KEY_TYPE];
		}
		console.log(params);
		return new Promise((resolve, reject) => {
			_this.DynamoDB.createTable(params, (err, data) => response(err,
				err ? params : data, resolve, reject));
		});
	}

	deleteTable(params){
		const _this = this;
		return new Promise((resolve, reject) => {
			_this.DynamoDB.deleteTable(params, (err, data) => response(err, data, resolve, reject));
		});
	}

	generateUUId(){
		return uuidv4().replace(/-/g, '');
	}

	generateRev(rev){
		if(rev){
			const revs = rev.split('-');
			return `${ parseInt(revs[0]) + 1 }-${ revs[1] }`;
		}
		return `1-${ this.generateUUId() }`;
	}

	insert(params){
		const _this = this;
		if(!params.Item.id){
			params.Item.id = _this.generateUUId();
		}
		if(!params.Item._rev){
			params.ConditionExpression = 'attribute_not_exists(id)';
		} else {
			params.ConditionExpression = 'attribute_exists(id) and #revKey = :revValue';
			params.ExpressionAttributeNames = { '#revKey': '_rev'};
			params.ExpressionAttributeValues = { ':revValue': params.Item._rev };
		}
		params.Item._rev = _this.generateRev(params.Item._rev);
		return new Promise((resolve, reject) => {
			_this.DynamoDBClient.put(params, (err, data) => response(err, params.Item || data, resolve, reject));
		});
	}

	findById(params){
		if(params.KeyConditionExpression || params.FilterExpression){
			return this.find(params);
		}
		const _this = this;
		return new Promise((resolve, reject) => {
			_this.DynamoDBClient.get(params,
				(err, data) => response(null, (err)? {} : data, resolve, reject));
		});
	}

	find(params){
		if(params.Key){
			return this.findById(params);
		}
		const _this = this;
		if(params.noPage){
			delete params.noPage;
			// eslint-disable-next-line no-async-promise-executor
			return new Promise(async (resolve, reject) => {
				const {error, data} = await _this.noPageFind(params);
				response(error, data, resolve, reject);
			});
		}
		return new Promise((resolve, reject) => {
			_this.DynamoDBClient.scan(params, (err, data) => response(err, data, resolve, reject));
		});
	}

	async noPageFind(params){
		let result, accumulated = [];
		do {
			try {
				result = await this.DynamoDBClient.scan(params).promise();
			} catch(e){
				console.error(e);
				return {error: e, data: []};
			}
			params.ExclusiveStartKey = result.LastEvaluatedKey;
			accumulated = [...accumulated, ...result.Items];
		} while (result.LastEvaluatedKey);
		return {error: null, data: {Items: accumulated}};
	}

	query(params){
		const _this = this;
		return new Promise((resolve, reject) => {
			_this.DynamoDBClient.query(params, (err, data) => response(err, data, resolve, reject));
		});
	}

	update(params){
		const _this = this;
		return new Promise((resolve, reject) => {
			_this.DynamoDBClient.update(params, (err, data) => response(err, data, resolve, reject));
		});
	}

	delete(params){
		const _this = this;
		return new Promise((resolve, reject) => {
			_this.DynamoDBClient.delete(params, (err, data) => response(err, data, resolve, reject));
		});
	}

}

function response(err, data, resolve, reject){
	if(err){
		if(err.code == 'ResourceInUseException'){
			console.log(`${ data.TableName } Table Exists`);
			resolve(false);
			return;
		}
		console.error(JSON.stringify(err, null, 2));
		reject(err);
		return;
	}
	resolve(data);
}

DynamoDBHandler.prototype.list = function(params){
	return new Promise((resolve, reject) => {
		DynamoDBClient.scan(params, (err, data) => response(err, data, resolve, reject));
	});
};

module.exports = DynamoDBHandler;
