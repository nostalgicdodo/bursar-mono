const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getJWTSecret } = require('@root/server/index.cjs');
const SALT_ROUNDS = 5;

/**
 * Creates a Signed JWT Token for a JSON body
 * @param {json} json
 * @param {object} options Contains options for signing like expiresIn, etc
 * @returns {string} token is successful
 */
function jwtSign(json, options = { expiresIn: '1h'}){
	return new Promise((resolve, reject) => {
		jwt.sign(json, getJWTSecret(), options, (err, token) => {
			if(err) return reject(err);
			resolve(token);
		});
	});
}

/**
 * Verifyies signature of Signed JWT token
 * @param {string} token
 * @returns {string} decoded body if successful
 */
function jwtVerify(token){
	return new Promise((resolve, reject) => {
		jwt.verify(token, getJWTSecret(), (err, decoded) => {
			if(err) return reject(err);
			if(new Date(decoded.exp * 1000) < new Date()) return reject({error: 'Expired', message: 'Time expired'});
			resolve(decoded);
		});
	});
}

/**
 * Performs Hashing of credential strings to be stored in DB
 * @param {string} text Password or credential text
 * @returns {string} hash value
 */
function encryptWithHash(text){
	return new Promise((resolve) => {
		bcrypt.hash(text, SALT_ROUNDS, (err, hash) => {
			if(err) return resolve(err);
			resolve(hash);
		});
	});
}

/**
 * Compares entered password or crednetial with hash
 * @param {string} text Entered password or credential to compare
 * @param {string} hash Existing hash from DB to compare
 * @returns {boolean} True or False depending on comparison
 */
function compareWithHash(text, hash){
	return new Promise((resolve) => {
		bcrypt.compare(text, hash, (err, response) => {
			if(err) return resolve(err);
			resolve(response);
		});
	});
}

function rbacCheck(roles){
	return (req, res, next) => {
		if(roles.indexOf(req.session.user.role) > -1){
			return next();
		}
		res.redirect('/404');
	};
}

module.exports = {
	jwtSign,
	jwtVerify,
	encryptWithHash,
	compareWithHash,
	rbacCheck,
};
