const express = require('express');
const router = express.Router();

router.use('/user', require('./User/user_controller'));
router.use('/admin', require('./Admin/admin_controller'));
router.use('/policy', require('./Policy/policy_controller'));

router.all('*', (req, res) => {
	res.status(404).send('route not found!');
});

module.exports = router;