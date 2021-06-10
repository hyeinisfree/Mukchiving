const express = require('express');
const router = express.Router();
const { mypageController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');



module.exports = router;