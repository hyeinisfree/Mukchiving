var express = require('express');
var router = express.Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');

router.use('/auth', authRouter);
router.use('/users', userRouter);

module.exports = router;