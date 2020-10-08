const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
	let { username,password,name,phonenumber,emailid,DOB,address,pincode,loan_amount,premium_amount } = req.body;
	password = bcrypt.hashSync(password, config.saltingTimes);
	try {
		await db.query(`INSERT INTO USER VALUES('${username}','${password}','${name}','${phonenumber}','${emailid}','${DOB}','${address}','${pincode}','${loan_amount}','${premium_amount}');`);
		res.status(200).json({ message: 'Successfully Created Account!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/login', async (req, res) => {
	let { username, password } = req.body;
	try {
		let user = await db.query(`SELECT * FROM USER WHERE USERNAME=${username}`);
		if (user.length === 0) {
			res.status(400).json({ message: 'username not found!' });
			return;
		}
		if (!bcrypt.compareSync(password, user.password)) {
			res.status(400).json({ message: 'Password did not match!' });
			return;
		}
		let token = jwt.sign({ username }, config.jwtsecret);
		res.status(200).json({ message: 'Logged-In Successfully', token });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});


router.get('/readall', async (req, res) => {
	try {
		let data=await db.query(`SELECT * FROM USER`);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});


router.post('/update', async (req, res) => {
	let { username,password,name,phonenumber,emailid,DOB,address,pincode,loan_amount,premium_amount } = req.body;

	password = bcrypt.hashSync(password, config.saltingTimes);
	try {
		await db.query(`REPLACE INTO USER VALUES ('${username}','${password}','${name}','${phonenumber}','${emailid}','${DOB}','${address}','${pincode}','${loan_amount}','${premium_amount}')`);
		res.status(200).json({ message: 'Successfully Updated User!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/delete', async (req, res) => {
	let { username } = req.body;
	try {
		await db.query(`DELETE FROM USER WHERE username like '${username}'`);
		res.status(200).json({ message: 'Successfully Deleted User!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});

module.exports = router;