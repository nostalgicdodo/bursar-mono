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

router.post('/set_password', async (req, res) => {
	const userId = req.session?.user.id;
	if (!userId) {
		return res.status(401).json({
			ok: false,
			status: 'Unauthorized',
		});
	}

	const user = new User();
	await user.findById(userId);
	user.doc.Item = {
		...user.doc.Item,
		password: req.body.newPassword,
		resetPassword: false,
	};

	await user.save(user.doc.Item);
	req.session.user = user.doc.Item;

	res.json({
		ok: true
	});
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
