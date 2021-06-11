var express = require('express');
var router = express.Router();
var db = require('../db');
var conn = db.init();
const { userController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');

db.connect(conn);

module.exports = router;