const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/readall', async (req, res) => {
	try {
		let data=await db.query(`SELECT * FROM CUSTOMER_CARE`);
		data.forEach(elt=>console.log(`INSERT INTO CUSTOMER_CARE VALUES (NULL,'${elt.DOB}','${elt.name}','${elt.address}','${elt.phone_number}','${elt.blood_group}','${elt.email_id}');`))
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/create',async (req, res) => {
	let { DOB,name,address,phone_number,blood_group,email_id } = req.body;
	try {
		console.log(`INSERT INTO CUSTOMER_CARE VALUES (NULL,'${DOB}','${name}','${address}','${phone_number}','${blood_group}','${email_id}');`);
		await db.query(`INSERT INTO CUSTOMER_CARE VALUES (NULL,'${DOB}','${name}','${address}','${phone_number}','${blood_group}','${email_id}')`);
		res.status(200).json({ message: 'Successfully Created Staff!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/update', async (req, res) => {
	let { staff_id,DOB,name,address,phone_number,blood_group,email_id } = req.body;
	try {
		await db.query(`REPLACE INTO CUSTOMER_CARE VALUES ('${staff_id}','${DOB}','${name}','${address}','${phone_number}','${blood_group}','${email_id}')`);
		res.status(200).json({ message: 'Successfully Updated Staff!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/delete', async (req, res) => {
	let { staff_id } = req.body;
	try {
		await db.query(`DELETE FROM CUSTOMER_CARE WHERE staff_id like '${staff_id}'`);
		res.status(200).json({ message: 'Successfully Deleted Staff!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});

module.exports = router;