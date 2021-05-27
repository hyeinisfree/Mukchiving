const express = require('express');
const router = express.Router();
const { profileController } = require('../controllers');
const { upload } = require('../s3');

router.post('/upload', upload.single("profileImage"), profileController.uploadImage);

module.exports = router;
