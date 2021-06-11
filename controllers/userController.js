const express = require('express');
const db = require('../db');
const { userService } = require('../services');
const conn = db.init();

db.connect(conn);

const userPost = (req, res) => {
  var user_id = req.params.id;
  const userPost = userService.userPost(user_id, function(err, results) {
    if(results) return res.json({success:true, message:"사용자 포스트 반환 성공", post : results});
    return res.status(400).json({success:false, message:"해당 사용자가 작성한 포스트가 없습니다."});
  });
}

module.exports = {
  userPost
}