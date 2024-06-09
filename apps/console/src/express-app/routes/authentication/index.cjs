const express = require('express');
const router = express.Router();
const User = require('@models/user.cjs');
const UserLogin = require('@models/userLogin.cjs');

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
		// (new UserLogin()).create({
		// 	id: req.body.userId,
		// 	datetime: new Date().toISOString(),
		// 	ip: '',
		// 	device: '',
		// 	success: true,
		// });
		return res.json({ok:true});
	}
	if(user.doc){
		// (new UserLogin()).create({
		// 	id: req.body.userId,
		// 	datetime: new Date().toISOString(),
		// 	ip: '',
		// 	device: '',
		// 	success: false,
		// });
	}
	res.json({ok:false});
});

router.get('/logout', (req, res, next) => {
	req.session.destroy(() => {
		next();
	});
});

module.exports = router;
