var express = require('express');
var router = express.Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const profileRouter = require('./profileRouter');
const mypageRouter = require('./mypageRouter');
const postRouter = require('./postRouter');

router.use('/auth', authRouter);
router.use('/mypage', mypageRouter);
router.use('/user', userRouter);
router.use('/profile', profileRouter);
router.use('/post', postRouter);

module.exports = router;