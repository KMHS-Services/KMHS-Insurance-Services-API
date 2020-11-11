const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/policy', async (req, res) => {
	try {
		let data=await db.query(`SELECT POLICY AS label, COUNT(*) AS y FROM POLICY_TAKEN GROUP BY POLICY`);
		res.status(200).json({ data });
	} catch (error) {
		res.status(error.status ? error.status : 500).json({ message: `error occured: ${error.message}` });
	}
});

module.exports=router