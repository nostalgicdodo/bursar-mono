const { createClient } = require('redis');
let redisClient;

function isProduction(){
	return process.env.NODE_APP_ENV === 'production';
}

function isDev(){
	return process.env.NODE_ENV !== 'production' || process.env.NODE_APP_ENV === 'development';
}

function isStaging(){
	return process.env.NODE_APP_ENV === 'staging';
}

function getRedisClient(){
	return redisClient;
}

function getAppName(){
	return process.env.NODE_APP_NAME;
}

function getRedisSecret(){
	return process.env.REDIS_SECRET;
}

function exceptionMailer(err){
	console.error(JSON.stringify(err));
	process.exit(1);
}

function getJWTSecret(){
	return process.env.JWT_HMAC_SECRET;
}

function getJuspayCreds(){
	return {
		url: process.env.JUSPAY_URL,
		key: Buffer.from(process.env.JUSPAY_AUTH_KEY).toString('base64'),
		paymentPageClientId: process.env.JUSPAY_PAYMENT_PAGE_CLIENT_ID,
	};
}

function getDecentroUrl(){
	return process.env.DECENTRO_URL;
}

function getDecentroAuthKeys(module = 'kyc'){
	return ({
		kyc: {
			module_secret: process.env.DECENTRO_KYC_MODULE_SECRET,
			client_secret: process.env.DECENTRO_CLIENT_SECRET,
			client_id: process.env.DECENTRO_CLIENT_ID,
		},
		credit: {
			provider_secret: process.env.DECENTRO_PROVIDER_SECRET,
			module_secret: process.env.DECENTRO_FIN_MODULE_SECRET,
			client_secret: process.env.DECENTRO_CLIENT_SECRET,
			client_id: process.env.DECENTRO_CLIENT_ID,
		}
	})[module];
}

function getDecentroCreditTestAccount(){
	return JSON.parse(process.env.DECENTRO_CREDIT_TEST_ACCOUNT);
}

function getHostname(){
	return process.env.SERVER_HOSTNAME;
}

function getServerPort(){
	return process.env.SERVER_PORT;
}

function initDB(){
	import('../lib/dbHandler/index.cjs')
		.then(() => console.log('DB Initialised'))
		.catch(console.error);
}

function init(){
	require('dotenv').config({path:`${__dirname}/../.env`});
	redisClient = createClient({
		legacyMode: true,
		url: process.env.REDIS_CONNECTION_STRING,
	});
	redisClient.connect().catch(console.error);
	initDB();
	if(isProduction()){
		process.on('uncaughtException', exceptionMailer);
	}
}

module.exports = {
	isProduction,
	isDev,
	isStaging,
	getRedisClient,
	getAppName,
	getRedisSecret,
	exceptionMailer,
	getJWTSecret,
	getJuspayCreds,
	getDecentroUrl,
	getDecentroAuthKeys,
	getDecentroCreditTestAccount,
	getHostname,
	getServerPort,
	initDB,
	init,
};
