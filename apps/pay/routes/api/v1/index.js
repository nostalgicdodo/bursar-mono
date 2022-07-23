const router = require('express').Router();

router.use(function(req, res, next){
	if(req.headers['x-authorization'] || req.session && req.session.transaction){
		return next();
	}
	res.redirect('/404');
});

router.use('/institutes', require('./institutes'));

router.use('/transactions', require('./transactions'));

module.exports = router;
