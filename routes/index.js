var express = require('express');
var router = express.Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const profileRouter = require('./profileRouter');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/profile', profileRouter);

module.exports = router;