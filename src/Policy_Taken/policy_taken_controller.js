const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/readall', async (req, res) => {
	try {
		let data=await db.query(`SELECT * FROM POLICY_TAKEN`);
		res.status(200).json({ data });
		console.log(data)
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/create',async (req, res) => {
	let { username, policy, admin_email_id } = req.body;
	try {
		await db.query(`INSERT INTO POLICY_TAKEN VALUES ('${username}','${policy}','${admin_email_id}');INSERT INTO TRANSACTION_HISTORY VALUES('${username}','${new Date().toISOString()}','-1')`);
		res.status(200).json({ message: 'Successfully applied Policy!' });
	} catch (error) {
		if (error.code === 'ER_DUP_ENTRY')
			return res.status(400).json({ message: 'already taken' });
			console.log(error);
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/update', async (req, res) => {
	let { username, policy, admin_email_id } = req.body;
	try {
		await db.query(`REPLACE INTO POLICY_TAKEN VALUES ('${username}','${policy}','${admin_email_id}')`);
		res.status(200).json({ message: 'Successfully Updated Policy Taken!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/delete', async (req, res) => {
	let { username, policy } = req.body;
	try {
		await db.query(`DELETE FROM POLICY_TAKEN WHERE username like '${username}' and policy like '${policy}'`);
		res.status(200).json({ message: 'Successfully Deleted Policy Taken!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});

module.exports = router;
