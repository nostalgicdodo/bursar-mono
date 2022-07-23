require('module-alias/register');
const { init, isDev, getServerPort, getHostname } = require('@root/server');
init();
const express = require('express');
const app = express();

if(!isDev()){
	app.enable('trust proxy');
}

app.use(require('./routes'));

app.listen(getServerPort(), getHostname(), () => {
	console.log(`App listening on port ${ getServerPort() }.`);
	console.log( `In ${process.env.NODE_ENV} mode.` );
});
