const express = require('express');
const router = express.Router();
const { isProduction, exceptionMailer } = require('@root/server');


router.use(express.json({
	limit: '50Mb',
}));

router.use(express.urlencoded({
	extended: true,
	limit: '50Mb',
	parameterLimit: 1000,
}));

router.use('/v1', require('./v1'));

// router.use('*', (req, res) => {
// 	res.status(404).json({
// 		error: 'Resource not found'
// 	});
// });

if(isProduction()){
	// eslint-disable-next-line no-unused-vars
	router.use((err, req, res, next) => {
		res.status(500).json({
			error: 'Oops! Something went wrong!'
		});
		exceptionMailer(err);
	});
}

module.exports = router;
