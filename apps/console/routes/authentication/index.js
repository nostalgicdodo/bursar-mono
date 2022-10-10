const express = require('express');
const router = express.Router();
const User = require('@models/user');
const UserLogin = require('@models/userLogin');

router.use(express.json({
	limit: '50Mb',
}));

router.use(express.urlencoded({
	extended: true,
	limit: '50Mb',
	parameterLimit: 1000,
}));

function forceRegenerateSession(req){
	return new Promise(resolve => {
		req.session.regenerate(() => {
			resolve();
		});
	});
}

router.post('/login', async (req, res) => {
	// if(req.session.user){
	// 	return res.redirect('/');
	// }
	const user = new User();
	if(await user.authenticate(req.body.userId, req.body.password)){
		await forceRegenerateSession(req);
		req.session.user = user.doc.Item;
		(new UserLogin()).create({
			id: req.body.userid,
			datetime: new Date().toISOString(),
			ip: '',
			device: '',
			success: true,
		});
		return res.redirect('/');
	}
	if(user.doc){
		(new UserLogin()).create({
			id: req.body.userid,
			datetime: new Date().toISOString(),
			ip: '',
			device: '',
			success: false,
		});
	}
	res.redirect('/');
});

router.get('/logout', (req, res) => {
	if(req.session.user){
		return req.session.destroy(() => {
			res.redirect('/');
		});
	}
	res.redirect('/');
});

module.exports = router;
