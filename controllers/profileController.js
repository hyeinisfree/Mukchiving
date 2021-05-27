var express = require('express');
var db = require('../db');
var conn = db.init();

db.connect(conn);

const uploadImage = async (req, res, next) => {
  const image = req.file;
  console.log('s3 이미지 경로 :', image.location);
};

module.exports = {
  uploadImage,
}
