require('module-alias/register');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const pathToModels = path.resolve( `${__dirname}${path.sep}..${path.sep}models` );
const modelFiles = fs.readdirSync( pathToModels )
// filter hidden or non-JS files
	.filter( function ( f ) {
		return (
			( !f.startsWith( '.' ) )
						&& f.endsWith( '.js' )
		);
	});

for ( const modelFile of modelFiles ) {
	const Model = require(`../models/${ modelFile }`);
	new Model().createTable()
		.then(result => result ? console.log(`${ modelFile } Table created!`) : '')
		.catch(console.error);
}
