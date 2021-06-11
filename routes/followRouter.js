const express = require('express');
const { followController } = require('../controllers');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

router.get('/check/:id', verifyToken, followController.checkFollow);
router.post('/create/:id', verifyToken, followController.createFollow);

module.exports = router;