var express = require('express');
var db = require('../db');
const { postService } = require('../services');
var conn = db.init();

const uploadImages = (req, res, next) => {
  const profile_images = req.files;
  console.log(profile_images);
  var location = [];
  for(var i=0; i<profile_images.length; i++) {
    location.push(profile_images[i].location);
  }
  return res.json({profile_images: location});
};

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

const createPost = (req, res, next) => {
  var user_id = req.decoded.user_id;
  var title = req.body.title;
  var memo = req.body.memo;
  var location = req.body.location;
  var score = req.body.score;
  var data = [user_id, title, memo, location, score];
  const createPost = postService.createPost(data, async function(err, results){
    if(err) return res.status(400).json({success: false, message: "포스트 DB 생성에 실패하였습니다."});
    if(results[0]) {
      if(req.body.images) {
        var images = req.body.images;
        var post_id = results[0].post_id;
        var image_data = {};
        image_data.post_id = post_id;
        image_data.images = images;
        const postImages = await postService.postImages(image_data, function(err, results){
          console.log(results);
          if(err) {
            const deletePost = postService.deletePost(post_id, function(err, results){
              if(err) next(err);
            })
            return res.status(400).json({success: false, message: "포스트 이미지 DB 생성에 실패하였습니다."});
          } 
          return res.status(201).json({success: true, message: "포스트 DB 및 포스트 이미지 DB가 정상적으로 생성되었습니다.", post_id: post_id});
        })
      } else return res.json({success: true, message: "포스트 DB 생성 성공", post_id: results[0].post_id});
    }
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
  uploadImages,
  createPost,
  detailPost
}