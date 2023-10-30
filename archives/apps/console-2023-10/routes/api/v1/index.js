const router = require('express').Router();
const { rbacCheck } = require('@lib/authentication');

router.use(function(req, res, next){
	if(req.session?.user){
		return next();
	}
	res.redirect('/404');
});

router.use('/institutes', rbacCheck(['sa']), require('./institutes'));

router.use('/transactions', rbacCheck(['sa', 'ad']), require('./transactions'));

router.use('/users', rbacCheck(['sa']), require('./users'));

module.exports = router;
