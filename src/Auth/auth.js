const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');



router.post('/login', async (req, res) => {
	let { username, password, isAdmin } = req.body;
	let passwordField = isAdmin ? 'admin_password' : 'password';
	try {
		console.log(`SELECT * FROM ${isAdmin ? 'ADMIN' : 'USER'} WHERE ${isAdmin ? 'admin_email_id' : 'username'} LIKE '${username}'`);
		let data = await db.query(`SELECT * FROM ${isAdmin ? 'ADMIN' : 'USER'} WHERE ${isAdmin ? 'admin_email_id' : 'username'} LIKE '${username}'`);
		if (data.length === 0 || !bcrypt.compareSync(password, data[0][passwordField]))
			return res.status(401).json({ message: 'Incorrect Username/Password' });
		let token = jwt.sign({ username: data[0].username, role: isAdmin ? 'Admin' : 'User' }, config.jwtsecret, {});
		return res.status(200).json({ message: 'Successfully Logged in', token });
	} catch (error) {
		console.log(error);
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/signup', async (req, res) => {
	let { username, password, name, phonenumber, emailid, DOB, address, pincode } = req.body;
	try {
		let data = await db.query(`INSERT INTO USER VALUES('${username}','${bcrypt.hashSync(password, config.saltingTimes)}','${name}','${phonenumber}','${emailid}','${DOB}','${address}','${pincode}','0','0')`);
		return res.status(200).json({ message: 'Successfully Signed Up!' });
	} catch (error) {

		if (error.code === 'ER_DUP_ENTRY')
			return res.status(400).json({ message: 'Username already taken' });
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

module.exports = router;

// console.log(bcrypt.hashSync('viswanathanmenon@gmail.com', config.saltingTimes));