var express = require('express');
var db = require('../db');
const { postService } = require('../services');
var conn = db.init();

const getPostId = (req, res) => {
  var title = req.params.title;
  const getPostId = postService.getPostId(title, function(err, results){
    if(results[0]) return res.json({success:true, message:"포스트 아이디 반환 성공", post_id : results});
    return res.status(400).json({success:false, message:"포스트 아이디 반환 실패"});
  })
}

const userPost = (req, res) => {
  var user_id = req.params.id;
  const userPost = postService.userPost(user_id, function(err, results) {
    if(results[0]) return res.json({success:true, message:"사용자 포스트 반환 성공", post : results});
    return res.status(400).json({success:false, message:"해당 사용자가 작성한 포스트가 없습니다."});
  });
}

const createPost = (req, res) => {
  var user_id = req.decoded.user_id;
  var title = req.body.title;
  var memo = req.body.memo;
  var location = req.body.locatio;
  var score = req.body.score;
  var data = [user_id, title, memo, location, score];
  const createPost = postService.createPost(data, function(err, results){
    if(results) return res.status(201).json({success: true, message: "포스트 DB가 정상적으로 생성되었습니다."});
    else return res.status(400).json({success: false, message: "포스트 DB 생성에 실패하였습니다."});
  })
}

const detailPost = (req, res) => {
  var post_id = req.params.id;
  const detailPost = postService.detailPost(post_id, function(err, results){
    console.log(results);
    if(results[0]) {
      var data = {
        post: results[0],
      };
      var user_id = results[0].user_id;
      const profileImage = postService.profileImage(user_id, function(err, results){
        console.log(results);
        if(results[0]) {
          data.profileImage = results[0];
          return res.json({success: true, message: "포스트 상세 반환 성공", data: data});
        }
        return res.status(400).json({success: false, message: "포스트 상세 반환 실패"});
      })
    } else {
      return res.status(400).json({success: false, message: "포스트 상세 반환 실패"});
    }
  })
}

module.exports = {
  getPostId,
  userPost,
  createPost,
  detailPost
}