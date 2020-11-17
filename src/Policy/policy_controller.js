const express = require('express');
const router = express.Router();
const db = require('../db');
const config = require('../../config.json');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/readall', async (req, res) => {
	try {
		let data=await db.query(`SELECT * FROM POLICY`);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/create',async (req, res) => {
	let { policy,scheme,rules,interest,is_active } = req.body;
	try {
		await db.query(`INSERT INTO POLICY VALUES ('${policy}','${scheme}','${rules}','${interest}','${is_active}')`);
		res.status(200).json({ message: 'Successfully Created Policy!' });
	} catch (error) {

		if (error.code === 'ER_DUP_ENTRY')
			return res.status(400).json({ message: 'policy already created' });
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});
router.post('/update', async (req, res) => {
	let { policy,scheme,rules,interest,is_active } = req.body;
	try {
		await db.query(`REPLACE INTO POLICY VALUES ('${policy}','${scheme}','${rules}','${interest}','${is_active}')`);
		res.status(200).json({ message: 'Successfully Updated Policy!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/delete', async (req, res) => {
	let { policy } = req.body;
	try {
		await db.query(`DELETE FROM POLICY WHERE policy like '${policy}'`);
		res.status(200).json({ message: 'Successfully Deleted Policy!' });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
});

router.get('/pickpolicy',async (req,res)=> {
	try {
		let data=await db.query(`SELECT * FROM POLICY WHERE IS_ACTIVE=1;SELECT * FROM ADMIN;SELECT * FROM USER`);
		let policies=[]
		let admins=[]
		let users=[]
		for(let policy of data[0])
			policies.push(policy.policy)
		for(let admin of data[1])
			admins.push(admin.admin_email_id)
		for(let user of data[2])
			users.push(user.username)
		res.status(200).json({ policies,admins,users });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error: ${error.message}` });
	}
})

module.exports = router;