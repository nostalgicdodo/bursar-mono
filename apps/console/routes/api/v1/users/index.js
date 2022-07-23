const router = require('express').Router();
const User = require('@models/user');

router.get('/list', async (req, res) => {
	const user = new User();
	res.json(await user.list());
});

router.post('/new', async(req, res) => {
	const user = new User();
	res.json(await user.create(req.body));
});

router.post('/reset_password', async(req, res) => {
	const user = new User();
	if(await user.authenticate(req.body.username, req.body.oldPassword)){
		await user.save({
			...user.doc.Item,
			password: req.body.newPassword,
			resetPassword: false,
		});
		return res.json({
			status: 'OK'
		});
	}
	res.json({
		status: 'FAILED',
	});
});

module.exports = router;
