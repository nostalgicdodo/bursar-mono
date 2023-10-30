require('module-alias')(`${__dirname}/../..`);
const { init, isDev, getServerPort, getHostname } = require('@root/server');
init();
const express = require('express');


const app = express();


if(!isDev()){
	app.enable('trust proxy');
	// https://expressjs.com/en/advanced/best-practice-security.html#reduce-fingerprinting
	app.disable('x-powered-by')
}

app.use(require('./routes'));

app.listen(getServerPort(), getHostname(), () => {
	console.log(`App listening on port ${ getServerPort() }.`);
	console.log( `In ${process.env.NODE_ENV} mode.` );
});
