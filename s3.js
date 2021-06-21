const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const env = process.env.NODE_ENV || 'development';
const s3_config = require('./config/s3-config')[env];

const s3 = new aws.S3({
  accessKeyId: s3_config.s3_keyId,
  secretAccessKey: s3_config.s3_private_key,
  region: s3_config.region
});

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3_config.bucket_name,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

exports.upload = multer(upload)
