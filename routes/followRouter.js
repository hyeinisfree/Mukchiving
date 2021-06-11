const express = require('express');
const { followController } = require('../controllers');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

router.get('/check/:id', verifyToken, followController.checkFollow);
router.post('/create/:id', verifyToken, followController.createFollow);
router.delete('/delete/:id', verifyToken, followController.unfollow);
router.get('/list/follower/', verifyToken, followController.followerList);
router.get('/list/following/', verifyToken, followController.followingList);
router.get('/list/follower/:id', verifyToken, followController.followerList);
router.get('/list/following/:id', verifyToken, followController.followingList);

module.exports = router;