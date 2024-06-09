const router = require('express').Router();
const Transaction = require('@models/transaction.cjs');

router.use(function(req, res, next){
	if(req.headers['x-authorization'] || req.session && req.session.transaction){
		return next();
	}
	// const date = new Date;
	// const ts = `${ date.getDate() }/${ date.getMonth() + 1 }/${ date.getFullYear() } ${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }`
	// console.log( `::${ ts }::${ req.url }: not authenticated` );
	res.redirect('/404');
});

router.use('/institutes', require('./institutes/index.cjs'));

router.use('/transactions', require('./transactions/index.cjs'));

module.exports = router;
