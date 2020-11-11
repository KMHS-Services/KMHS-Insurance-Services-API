var jwt = require('jsonwebtoken');
var config = require('../../config.json');
var db = require('../db');

async function check(req) {
	var token = req.headers['authorization'];
	if (!token || !token.split(' ')[1])
		throw new Error('No token provided');
	var decoded = await jwt.verify(token.split(' ')[1], config.jwtsecret);
	req.username = decoded.username;
	req.role = decoded.role;
	if (!obj)
		throw new Error('Failed to authenticate token.');
	return true;
}

function verifyToken(req, res, next) {

	check(req).then((obj) => {
		next();
	}).catch((err) => {
		res.status(401).send({ auth: false, message: err.toString() });
	});

}

module.exports = verifyToken;