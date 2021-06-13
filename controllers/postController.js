var express = require('express');
var db = require('../db');
const { post } = require('../routes');
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

const getPostIdByTitle = (req, res) => {
  var title = req.params.title;
  const getPostIdByTitle = postService.getPostId(title, function(err, results){
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
      if(req.body.images || req.body.tag) {
        if(req.body.images && !req.body.tag) {
          var post_id = results[0].post_id;
          var image_data = {};
          var images = req.body.images;
          image_data.post_id = post_id;
          image_data.images = images;
          const createPostImages = await postService.createPostImages(image_data, function(err, results){
            if(err) {
              const deletePost = postService.deletePost(post_id, function(err, results){
                if(err) next(err);
              })
              return res.status(400).json({success: false, message: "포스트 이미지 DB 생성에 실패하였습니다."});
            }
            return res.status(201).json({success: true, message: "포스트 DB 및 포스트 이미지 DB가 정상적으로 생성되었습니다.", post_id: post_id});
          })
        } else if(req.body.tag && !req.body.images) {
          var post_id = results[0].post_id;
          var tag_data = {};
          var tag = req.body.tag;
          tag_data.post_id = post_id;
          tag_data.tag = tag;
          const createPostTag = await postService.createPostTag(tag_data, function(err, results){
            if(err) {
              const deletePost = postService.deletePost(post_id, function(err, results){
                if(err) next(err);
              })
              return res.status(400).json({success: false, message: "포스트 태그 DB 생성에 실패하였습니다."});
            }
            return res.status(201).json({success: true, message: "포스트 DB 및 포스트 태그 DB가 정상적으로 생성되었습니다.", post_id: post_id});
          })
        } else {
          var post_id = results[0].post_id;
          var image_data = {};
          var images = req.body.images;
          image_data.post_id = post_id;
          image_data.images = images;
          const createPostImages = await postService.createPostImages(image_data, async function(err, results){
            if(err) {
              const deletePost = postService.deletePost(post_id, function(err, results){
                if(err) next(err);
              })
              return res.status(400).json({success: false, message: "포스트 이미지 DB 생성에 실패하였습니다."});
            }
            var tag_data = {};
            var tag = req.body.tag;
            tag_data.post_id = post_id;
            tag_data.tag = tag;
            const createPostTag = await postService.createPostTag(tag_data, function(err, results){
              if(err) {
                const deletePost = postService.deletePost(post_id, function(err, results){
                  if(err) next(err);
                  const deletePostImages = postService.deletePostImages(post_id, function(err, reults){
                    if(err) next(err);
                  })
                })
                return res.status(400).json({success: false, message: "포스트 태그 DB 생성에 실패하였습니다."});
              }
              else return res.status(201).json({success: true, message: "포스트 DB 및 포스트 이미지 DB 및 포스트 태그 DB가 정상적으로 생성되었습니다.", post_id: post_id});
            })
          })
        }
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
      const userProfile = postService.userProfile(user_id, function(err, results){
        console.log(results);
        if(results[0]) {
          data.user_profile = results[0];
          const getPostImages = postService.getPostImages(post_id, function(err, results){
            if(results) {
              var post_images = [];
              for(var i=0; i<results.length; i++) {
                post_images.push(results[i].image_url);
              }
              data.post_images = post_images;
              const getPostTags = postService.getPostTags(post_id, function(err, results){
                if(results) {
                  var post_tag = [];
                  for(var i=0; i<results.length; i++) {
                    post_tag.push(results[i].tag_title);
                  }
                  data.post_tag = post_tag;
                  return res.json({success: true, message: "포스트 상세 반환 성공", data: data});
                } else {
                  return res.json({success: true, message: "포스트 상세 반환 성공", data: data});
                }
              })
            } else {
              return res.status(400).json({success: false, message: "포스트 상세 반환 실패"});
            }
          })
        } else return res.status(400).json({success: false, message: "포스트 상세 반환 실패"});
      })
    } else {
      return res.status(400).json({success: false, message: "포스트 상세 반환 실패"});
    }
  })
}

const createTag = (req, res) => {
  var title = req.body.title;
  const createTag = postService.createTag(title, function(err, results){
    console.log(results);
    if(results) return res.json({success: true, message: "태그 DB 생성 성공", tag_id: results[0].tag_id});
    else return res.json({success: false, message: "태그 DB 생성 실패"});
  })
}

const feedPost = (req, res) => {
  var user_id = req.decoded.user_id;
  const feedPost = postService.feedPost(user_id, async function(err, results){
    console.log(results);
    if(results) {
      var feed_data = {};
      feed_data.post = results;
      var post_id = [];
      var user_id = [];
      for(var i=0; i<results.length; i++){
        post_id.push(results[i].post_id);
        user_id.push(results[i].user_id);
      }
      const getFeedPostImages = await postService.getFeedPostImages(post_id, async function(err, results){
        if(results) {
          feed_data.post_images = results;
          const getFeedUserProfile = await postService.getFeedUserProfile(user_id, function(err, results){
            if(results) {
              console.log(results);
              feed_data.user_info = results;
              return res.json({success: true, message:"피드 조회 성공", feed_data: feed_data});
            } else return res.json({success: true, message:"피드 조회 성공", feed_data: feed_data});
          })
        } else return res.json({success: true, message:"피드 조회 성공", feed_data: feed_data});
      })
    } else return res.json({success: true, message:"피드 조회 실패"});
  })
}

module.exports = {
  getPostIdByTitle,
  userPost,
  uploadImages,
  createPost,
  detailPost,
  createTag,
  feedPost,
}