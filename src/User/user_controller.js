const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
	let { username, password, name, phonenumber, emailid, DOB, address, pincode, loan_amount, premium_amount } = req.body;
	password = bcrypt.hashSync(password, config.saltingTimes);
	try {
		await db.query(`INSERT INTO USER VALUES('${username}','${password}','${name}','${phonenumber}','${emailid}','${DOB}','${address}','${pincode}','${loan_amount}','${premium_amount}');`);
		res.status(200).json({ message: 'Successfully Created Account!' });
	} catch (error) {

		if (error.code === 'ER_DUP_ENTRY')
			return res.status(400).json({ message: 'username already taken' });
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
		let data = await db.query(`SELECT * FROM USER`);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});


router.post('/update', async (req, res) => {
	let { username, password, name, phonenumber, emailid, DOB, address, pincode, loan_amount, premium_amount } = req.body;

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



router.post('/mypolicy', async (req, res) => {
	try {
		let data = await db.query(`SELECT * FROM POLICY_TAKEN WHERE USERNAME LIKE '${req.body.username}'`);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.get('/duepeople', async function (req, res) {
	try {
		let result = {};
		let people = await db.query(`SELECT * FROM USER`);
		let currentDate = new Date();
		for (const person of people) {
			try {
				let policies = await db.query(`SELECT * FROM TRANSACTION_HISTORY WHERE USERNAME LIKE '${person.username}' AND TRANSACTION_AMOUNT = -1`);
				let due = 0;
				for (const policy of policies) {
					due += (currentDate - new Date(policy.transaction_time)) / 3600;
				}
				due *= person.premium_amount;
				let total = await db.query(`SELECT SUM(TRANSACTION_AMOUNT) AS TOTAL FROM TRANSACTION_HISTORY WHERE USERNAME LIKE '${person.username}'`);
				due -= total[0].TOTAL;
				due -= policies.length;
				console.log(`${person.username}`, due);
				if (due > 0) {

					result[person.username] = due;
				}
			} catch (error) {
				res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
			}
		}
		res.status(200).json(result);
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});
router.post('/discontinuedprofit', async function (req, res) {
	// try {
	// 	let { username, policy } = req.body;
	// 	let personrecord = await db.query(`SELECT * FROM USER WHERE USERNAME LIKE '${username}'`);
	// 	let policyrecord = await db.query(`SELECT * FROM POLICY WHERE POLICY LIKE '${policy}'`);
	// 	let starttransaction = await db.query(`SELECT * FROM TRANSACTION_HISTORY WHERE USERNAME LIKE '${username}' AND TRANSACTION_AMOUNT = -1`);
	// 	if (starttransaction.length === 0)
	// 		return res.status(200).json({ amount: 0 });
	// 	let due = 0;
	// 	for (const policy of policies) {
	// 		due += (currentDate - new Date(policy.transaction_time)) / 3600;
	// 	}
	// 	due *= person.premium_amount;
	// 	let total = await db.query(`SELECT SUM(TRANSACTION_AMOUNT) AS TOTAL FROM TRANSACTION_HISTORY WHERE USERNAME LIKE '${person.username}'`);
	// 	due -= total[0].TOTAL;
	// 	due -= policies.length;
	// 	console.log(`${person.username}`, due);
	// 	if (due > 0) {
	// 		return res.status(200).json({ amount: 0, due: true });
	// 	}
	// 	else
	// 		return res.status(200).json({ amount: ((currentDate - new Date(policy.transaction_time)*(policyrecord.interest/100)) / 3600)-due });
	// } catch (error) {
	// 	res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	// }
});


module.exports = router;