const express = require('express');
const { postController } = require('../controllers');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');

router.post('/create', verifyToken, postController.createPost);
router.get('/detail/:id', verifyToken, postController.detailPost);

module.exports = router;