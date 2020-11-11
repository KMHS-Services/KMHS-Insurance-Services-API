const express = require('express');
const router = express.Router();

router.use('/user', require('./User/user_controller'));
router.use('/admin', require('./Admin/admin_controller'));
router.use('/policy', require('./Policy/policy_controller'));
router.use('/staff', require('./Customer_Care/customer_care_controller'));
router.use('/auth', require('./Login/Login'));
router.use('/policytaken', require('./Policy_Taken/policy_taken_controller'));
router.use('/transaction', require('./Transaction_History/transaction_history_controller'));

router.all('*', (req, res) => {
	res.status(404).send('route not found!');
});

module.exports = router;