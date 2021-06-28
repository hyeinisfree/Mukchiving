const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');

router.get('/all', userController.getAll);
router.get('/info', verifyToken, userController.info);

module.exports = router;