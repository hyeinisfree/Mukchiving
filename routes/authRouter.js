const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { verifyToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/checkUsername/:username', authController.checkUsername);
router.get('/checkId/:id', authController.checkId);
router.post('/sendAuthNumber', authController.sendAuthNumber);
router.post('/signup', authController.signup);

module.exports = router;