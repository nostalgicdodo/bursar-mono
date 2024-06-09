module.exports = {
	getFilterQuery({
		instituteId,
		fromDate,
		toDate,
		status,
		limit,
		nextPage,
		asc = false,
	}){
		const query = {
			ExpressionAttributeNames: {},
			ExpressionAttributeValues: {},
			ScanIndexForward: asc,
			limit,
			next: nextPage,
			withPage: true,
		};
		if(instituteId){
			query.IndexName = 'instituteId-createdAt-index';
			query.KeyConditionExpression = '#iid = :iid';
			query.ExpressionAttributeNames['#iid'] = 'instituteId';
			query.ExpressionAttributeValues[':iid'] = instituteId;
		} else {
			delete query.ExpressionAttributeNames;
			delete query.ExpressionAttributeValues;
			return query;
		}
		if(fromDate && toDate){
			query.KeyConditionExpression += ' AND #cr BETWEEN :fd AND :td';
			query.ExpressionAttributeNames['#cr'] = 'createdAt';
			query.ExpressionAttributeValues[':fd'] = fromDate;
			query.ExpressionAttributeValues[':td'] = toDate;
		} else {
			if(fromDate){
				query.KeyConditionExpression += ' AND #cr >= :fd';
				query.ExpressionAttributeNames['#cr'] = 'createdAt';
				query.ExpressionAttributeValues[':fd'] = fromDate;
			}
			if(toDate){
				query.KeyConditionExpression += ' AND #cr <= :td';
				query.ExpressionAttributeNames['#cr'] = 'createdAt';
				query.ExpressionAttributeValues[':td'] = toDate;
			}
		}
		if(status){
			query.ExpressionAttributeNames['#s'] = 'status';
			if ( status === 'unresolved' ) {
				query.FilterExpression = 'NOT #s IN (:stval1, :stval2)';
				query.ExpressionAttributeValues[':stval1'] = 'success';
				query.ExpressionAttributeValues[':stval2'] = 'failed';
			}
			else {
				const statuses = status.split(',');
				const exp = [];
				for(const i in statuses){
					exp.push(`:s${ i }`);
					query.ExpressionAttributeValues[`:s${ i }`] = statuses[i];
				}
				query.FilterExpression = `#s IN ( ${ exp.join(',') } )`;
			}
		}
		return query;
	},
};