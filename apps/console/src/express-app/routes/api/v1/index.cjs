const router = require('express').Router();
const { rbacCheck } = require('@lib/authentication/index.cjs');

router.use(function(req, res, next){
	if(req.session?.user){
		return next();
	}
	res.redirect('/404');
});

router.use('/institutes', rbacCheck(['sa']), require('./institutes/index.cjs'));

router.use('/transactions', rbacCheck(['sa', 'ad']), require('./transactions/index.cjs'));

router.use('/users', rbacCheck(['sa']), require('./users/index.cjs'));

module.exports = router;
