const express = require('express');
const { postController } = require('../controllers');
const router = express.Router();
const { upload } = require('../s3');
const { verifyToken } = require('../middleware/auth');

router.get('/getId/:title', verifyToken, postController.getPostIdByTitle);
router.get('/user/:id', verifyToken, postController.userPost);
router.post('/uploadImages', verifyToken, upload.array("images"), postController.uploadImages);
router.post('/create', verifyToken, postController.createPost);
router.get('/detail/:id', verifyToken, postController.detailPost);
router.post('/createTag', verifyToken, postController.createTag);
router.get('/feed', verifyToken, postController.feedPost);

module.exports = router;