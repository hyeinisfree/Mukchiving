const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/checkUsername', authController.checkUsername);
router.get('/checkId', authController.checkId);
router.post('/sendAuthNumber', authController.sendAuthNumber);
router.post('/signup', authController.signup);
router.get('/check', verifyToken ,authController.check);

module.exports = router;