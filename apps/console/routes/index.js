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
		maxAge: 1000 * 60 * 60 * 24 * 7, // one week
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
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 7, // one week
	}
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

router.use((req, res, next) => {
	if (req.query._source === 'ui') {
		res.status = function (code) {
			req.remixContext = req.remixContext ?? { };
			req.remixContext.response = req.remixContext.response ?? { };
			req.remixContext.response.code = code;
			return res;
		}
		res.json = function (responseBody){
			req.remixContext = req.remixContext ?? { };
			req.remixContext.response = req.remixContext.response ?? { };
			req.remixContext.response.body = responseBody
			next();
		};
	}

	next();
});
router.use('/api', require('./api'));
router.use('/_d', require('@routes/diagnostics'));
router.use('/auth', require('./authentication'));

router.use(require('./remix'));

if(isProduction()){
	// eslint-disable-next-line no-unused-vars
	router.use((err, req, res, next) => {
		res.status(500).send('Oops! Something went wrong!');
		exceptionMailer(err);
	});
}

module.exports = router;
