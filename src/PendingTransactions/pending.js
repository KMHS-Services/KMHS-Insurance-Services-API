const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/transactions', async (req, res) => {
	try {
		let data=await db.query(`SELECT * FROM TRANSACTION_HISTORY T WHERE 10>=ALL(SELECT INTEREST FROM POLICY WHERE POLICY=T.POLICY)`);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});


module.exports = router;
