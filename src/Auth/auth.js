const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');
const bcrypt=require('bcryptjs');



router.post('/login', async (req, res) => {
	let { username, password, isAdmin } = req.body;
	let passwordField=isAdmin?'admin_password':'password'
	console.log(username,password,isAdmin);
	try {
		console.log(`SELECT * FROM ${isAdmin ? 'ADMIN' : 'USER'} WHERE ${isAdmin ? 'admin_email_id' : 'username'} LIKE '${username}'`);
		let data = await db.query(`SELECT * FROM ${isAdmin ? 'ADMIN' : 'USER'} WHERE ${isAdmin ? 'admin_email_id' : 'username'} LIKE '${username}'`);
		console.log(data,password,data[0][passwordField],(data.length === 0||!bcrypt.compareSync(password,data[0][passwordField])));
		if (data.length === 0||!bcrypt.compareSync(password,data[0][passwordField]))
			return res.status(401).json({ message: 'Incorrect Username/Password' });

		let token = jwt.sign({ username: data[0].username, role: isAdmin ? 'Admin' : 'User' }, config.jwtsecret, {});
		return res.status(200).json({ message: 'Successfully Logged in', token });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

router.post('/signup',async(req,res)=>{
	let { username, password, name, phonenumber, emailid, DOB, address, pincode, loan_amount, premium_amount  } = req.body;
	try {
		let data = await db.query(`INSERT INTO USER VALUES('${username}','${bcrypt.hashSync(password,config.saltingTimes)}','${name}','${phonenumber}','${emailid}','${DOB}','${address}','${pincode}','${loan_amount}','${premium_amount}')`);
		return res.status(200).json({ message: 'Successfully Signed Up!', token });
	} catch (error) {
		console.log(error.code);
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
})

// console.log(bcrypt.hashSync('arvind_mishra',config.saltingTimes))
module.exports = router;
