const express = require('express');
const router = express.Router();
const { profileController } = require('../controllers');
const { upload } = require('../s3');
const { verifyToken } = require('../middleware/auth');

router.get('/get/:id', verifyToken, profileController.getProfile);
router.patch('/update', verifyToken, profileController.updateProfile);
router.post('/uploadImage', verifyToken, upload.single("profileImage"), profileController.uploadProfileImage);

module.exports = router;
