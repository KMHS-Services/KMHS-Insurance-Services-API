const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');


router.get('/login', async (req, res) => {
	let { username, password, isAdmin } = req.body;
	try {
		let data = await db.query(`SELECT * FROM ${isAdmin ? 'ADMIN' : 'USER'} WHERE ${isAdmin ? 'admin_email_id' : 'username'} LIKE ${username} PASSWORD LIKE ${password}`);
		if (data.length === 0)
			return res.status(401).json({ message: 'Incorrect Username/Password' });

		let token = jwt.sign({ username: data[0].username, role: isAdmin ? 'Admin' : 'User' }, config.secret, {});
		return res.status(200).json({ message: 'Successfully Logged in', token });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

module.exports = router;
