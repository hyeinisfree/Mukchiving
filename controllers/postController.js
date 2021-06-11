var express = require('express');
var db = require('../db');
const { postService } = require('../services');
var conn = db.init();

const createPost = (req, res) => {
  var user_id = req.decoded.user_id;
  var title = req.body.title;
  var memo = req.body.memo;
  var location = req.body.locatio;
  var score = req.body.score;
  var data = [user_id, title, memo, location, score];
  const createPost = postService.createPost(data, function(err, results){
    if(results) return res.status(201).json({success: true, message: "포스트 DB가 정상적으로 생성되었습니다."});
    return res.status(400).json({success: false, message: "포스트 DB 생성에 실패하였습니다."});
  })
}

module.exports = {
  createPost,
}