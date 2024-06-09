const router = require('express').Router();

router.get('/redis', function(req, res){
	// Fetch the session from Redis;
	// it'll be empty *if* this route is being visited for the first time
	const time = req.session._time;
	// Assign an arbitrary value to an arbitrary session key
	req.session._time = Date.now();

	let response;
	if ( time !== void 0 ) {
		response = {
			status: 'Redis is operational.'
		};
	} else {
		response = {
			status: 'If on refreshing this page, you see this same message, then Redis is not persisting the session.',
			suggestion: 'Check you environment configuration and ensure that the Redis credentials are indeed working.'
		};
	}
	res.json( response );
} );

module.exports = router;
