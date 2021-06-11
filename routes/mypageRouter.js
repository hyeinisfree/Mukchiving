const express = require('express');
const router = express.Router();
const { mypageController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');

router.get('/info/:id', verifyToken, mypageController.info);

module.exports = router;