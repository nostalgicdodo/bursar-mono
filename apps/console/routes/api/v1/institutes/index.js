const router = require('express').Router();
const Institute = require('@models/institute');

router.get('/:instituteId/regenerate_api_credentials', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		res.json(await institute.regenerateAPICredentials(doc.Item));
	} else {
		res.status(404).json({
			error: 'Resource not found'
		});
	}
});

router.post('/:instituteId/extend_license', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		doc.Item.expiresOn = new Date(req.body.expires).toISOString();
		res.json(await institute.regenerateAPICredentials(doc.Item));
	} else {
		res.status(404).json({
			error: 'Resource not found'
		});
	}
});

router.get('/', async (req, res) => {
	const institutes = new Institute();
	res.json(await institutes.list());
});

router.post('/', async (req, res) => {
	const institute = new Institute();
	req.body.shortId = Math.floor(new Date().getTime() / 1000);
	res.json(await institute.create(req.body));
});

router.get('/:instituteId/', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		res.json(doc.Item);
	} else {
		res.status(404).json({
			error: 'Resource not found'
		});
	}
});

router.put('/:instituteId/', async (req, res) => {
	const institute = new Institute();
	const doc = await institute.findById(req.params.instituteId);
	if(doc.Item){
		res.json(await institute.save({...doc.Item, ...req.body }));
	} else {
		res.status(404).json({
			error: 'Resource not found',
		});
	}
});

router.delete('/:instituteId/', async (req, res) => {
	const institute = new Institute();
	res.json(await institute.delete(req.params.instituteId));
});

module.exports = router;
