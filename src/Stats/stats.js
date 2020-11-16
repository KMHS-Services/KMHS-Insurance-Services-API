const { query } = require('express');
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/policy', async (req, res) => {
	try {
		let data = await db.query(`SELECT POLICY AS label, COUNT(*) AS y FROM POLICY_TAKEN GROUP BY POLICY`);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.get('/age', async (req, res) => {
	try {
		let data = await db.query(`SELECT admin_DOB AS dob FROM admin`);
		console.log(data);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});


router.get('/financegraph', async (req, res) => {
	try {
		let data = await db.query('SELECT * FROM TRANSACTION_HISTORY ORDER BY TRANSACTION_TIME');
		console.log(data);
		let ans = [], sum = 0;
		for (const transaction of data) {
			if (transaction.transaction_amount > 0)
				sum += transaction.transaction_amount;
			ans.push({
				x: (new Date(transaction.transaction_time)).valueOf(),
				y: sum
			});
		}
		res.status(200).json({data:ans})
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.get('/adminpolicies', async (req, res) => {
	try {
		let data = await db.query('select admin_name as label, count(*) as y from policy_taken A inner join admin B where A.admin_email_id=B.admin_email_id group by A.admin_email_id');
		console.log(data);
		res.status(200).json({data})
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.get('/adminusers', async (req, res) => {
	try {
		let data = await db.query('select admin_name as label,count(distinct(username)) as y from policy_taken A inner join admin B where A.admin_email_id=B.admin_email_id group by A.admin_email_id');
		res.status(200).json({data})
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

module.exports = router;