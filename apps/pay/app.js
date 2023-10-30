require('module-alias')(`${__dirname}/../..`);
const { init, isDev, getServerPort, getHostname } = require('@root/server');
init();
const express = require('express');
const app = express();

if(!isDev()){
	app.enable('trust proxy');
}

app.use(require('./routes'));

app.listen(getServerPort(), getHostname(), () => {
	if (typeof process.send === "function") {
		process.send("ready")
			// ^ when process is managed with PM2
	}
	console.log(`App listening on port ${ getServerPort() }.`);
	console.log( `In ${process.env.NODE_ENV} mode.` );
});
