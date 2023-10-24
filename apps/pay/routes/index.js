const router = require('express').Router();
const Session = require('express-session');
const connectRedis = require('connect-redis');
const RedisStore = connectRedis(Session);
const compression = require('compression');
const cors = require('cors');
const { isProduction, exceptionMailer, getRedisClient, getAppName, getRedisSecret } = require('@root/server');

const SessionMiddleware = isProduction() ? Session({
	secret: getRedisSecret(),
	store: new RedisStore({client: getRedisClient()}),
	saveUninitialized: false,
	resave: true,
	name: getAppName(),
	cookie: {
		maxAge: 1000 * 60 * 19, // 19 minutes
			// ^ this has to be greater than the transaction session duration (in models/transaction.js)
		secure: true,
		httpOnly: true,
		sameSite: 'none',
	}
}) : Session({
	secret: getRedisSecret(),
	store: new RedisStore({client: getRedisClient()}),
	saveUninitialized: false,
	resave: true,
	name: getAppName(),
});

router.use(cors());

router.use(compression());

router.use((req, res, next) => {
	// If a request has the following header, then do not bother setting up a session
	// This is because requests with the following header are assumed to be API requests
	// For API requests, there is simply no need for sessions
	if(req.headers['x-authorization']){
		return next();
	}
	SessionMiddleware(req, res, next);
});

router.use('/api', require('./api'));
router.use('/transaction', require('./transactions'));
router.use('/_d', require('@routes/diagnostics'));
router.use(require('./frontend'));

if(isProduction()){
	// eslint-disable-next-line no-unused-vars
	router.use((err, req, res, next) => {
		res.status(500).send('Oops! Something went wrong!');
		exceptionMailer(err);
	});
}

module.exports = router;
