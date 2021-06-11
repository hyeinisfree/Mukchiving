const express = require('express');
const { followController } = require('../controllers');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

router.post('/create', verifyToken, followController.createFollow);

module.exports = router;