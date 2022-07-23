function transactionUserDetailsValidation({
	documentType,
	documentId,
	userRelationType,
	userMobile,
	userEmail
}){
	return (
		typeof documentId === 'string' &&
		typeof documentType === 'number' &&
		typeof userRelationType === 'number' &&
		typeof userMobile === 'string' &&
		typeof userEmail === 'string'
	);
}

module.exports = {
	transactionUserDetailsValidation,
};
