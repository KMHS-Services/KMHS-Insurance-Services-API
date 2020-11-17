const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
	let { admin_email_id, admin_password, admin_name, admin_address, admin_pincode,admin_phone_number,admin_DOB,admin_blood_group } = req.body;
	admin_password = bcrypt.hashSync(admin_password, config.saltingTimes);
	try {
		console.log(`INSERT INTO ADMIN VALUES('${admin_email_id}','${admin_password}','${admin_name}','${admin_address}','${admin_pincode}','${admin_phone_number}','${admin_DOB}','${admin_blood_group}');`);
		await db.query(`INSERT INTO ADMIN VALUES('${admin_email_id}','${admin_password}','${admin_name}','${admin_address}','${admin_pincode}','${admin_phone_number}','${admin_DOB}','${admin_blood_group}');`);
		res.status(200).json({ message: 'Successfully Created Account!' });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY')
			return res.status(400).json({ message: 'admin_email_id already taken' });
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/login', async (req, res) => {
	let { username, password } = req.body;
	try {
		let user = await db.query(`SELECT * FROM ADMIN WHERE USERNAME=${username}`);
		if (user.length === 0) {
			res.status(400).json({ message: 'username not found!' });
			return;
		}
		if (!bcrypt.compareSync(password, user.admin_password)) {
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
		let data=await db.query(`SELECT * FROM ADMIN`);
		data.forEach(admin => {
			admin.admin_password='~'
		});
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});


router.post('/update', async (req, res) => {
	let { admin_email_id, admin_password, admin_name, admin_address, admin_pincode,admin_phone_number,admin_DOB,admin_blood_group } = req.body;

	admin_password = bcrypt.hashSync(admin_password, config.saltingTimes);
	try {
		await db.query(`REPLACE INTO ADMIN VALUES ('${admin_email_id}','${admin_password}','${admin_name}','${admin_address}','${admin_pincode}','${admin_phone_number}','${admin_DOB}','${admin_blood_group}')`);
		res.status(200).json({ message: 'Successfully Updated Admin!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/delete', async (req, res) => {
	let { admin_email_id } = req.body;
	try {
		await db.query(`DELETE FROM ADMIN WHERE admin_email_id like '${admin_email_id}'`);
		res.status(200).json({ message: 'Successfully Deleted Admin!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});

module.exports = router;