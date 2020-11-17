const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get('/readall', async (req, res) => {
	try {
		let data = await db.query(`SELECT * FROM TRANSACTION_HISTORY`);
		data.forEach(element => {
			try {
				element.transaction_localetime = new Date(element.transaction_time).toLocaleString();
			} catch (error) {

			}
		});
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/create', async (req, res) => {
	let { username, transaction_amount } = req.body;
	try {
		transaction_time = new Date().toISOString();
		await db.query(`INSERT INTO TRANSACTION_HISTORY VALUES ('${username}','${transaction_time}','${transaction_amount}')`);
		res.status(200).json({ message: 'Transaction Successful!' });
	} catch (error) {

		if (error.code === 'ER_DUP_ENTRY')
			return res.status(400).json({ message: 'transaction already done' });
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/update', async (req, res) => {
	let { username, transaction_time, transaction_amount } = req.body;
	try {
		await db.query(`REPLACE INTO TRANSACTION_HISTORY VALUES ('${username}','${transaction_time}','${transaction_amount}')`);
		res.status(200).json({ message: 'Transaction updated!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/delete', async (req, res) => {
	let { username, transaction_time } = req.body;
	try {
		let result=await db.query(`DELETE FROM TRANSACTION_HISTORY WHERE username like '${username}' and transaction_time like '${transaction_time}'`);
		console.log(result);
		res.status(200).json({ message: 'Successfully Deleted Transaction!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});

router.get('/usernames', async (req, res) => {
	try {
		let users = await db.query(`SELECT * FROM USER`);
		let data = {};
		for (const user of users) {
			data[user.username] = user.username;
		}
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});



module.exports = router;
