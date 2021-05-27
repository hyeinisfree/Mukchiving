const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3_config = require('./config/s3-config.json');

const s3 = new aws.S3({
  accessKeyId: s3_config.S3_KEYID,
  secretAccessKey: s3_config.S3_PRIVATE_KEY,
  region: s3_config.REGION
});

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3_config.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

exports.upload = multer(upload)
