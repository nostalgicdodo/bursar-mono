function transactionRequestValidation({ refId, amount, successRedirect, type }){
	return (typeof refId === 'string' &&
		typeof amount === 'number' &&
		typeof successRedirect === 'string' &&
		typeof type === 'string');
}

function transactionDetailsValidation({ instituteId, transactionId, refId }){
	return (typeof instituteId === 'string' &&
		typeof transactionId === 'string' &&
		typeof refId === 'string');
}

module.exports = {
	transactionRequestValidation,
	transactionDetailsValidation,
};
