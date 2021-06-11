var express = require('express');

var { userService, followService } = require('../services');

const checkFollow = (req, res) => {
  var receiver = req.params.id;
  var sender = req.decoded.user_id;
  var data = [receiver, sender];

  const checkFollow = followService.checkFollow(data, function(err, results){
    if(results[0]) {
      return res.json({check: true, message: "팔로우 중인 사용자입니다."});
    } else {
      return res.json({check: false, message: "팔로우 중인 사용자가 아닙니다."});
    }
  })
}

// follow_receiver, follow_sender, created_at, accept
const createFollow = (req, res) => {
  var receiver = req.params.id;
  var sender = req.decoded.user_id;

  const userPrivacy = userService.userPrivacy(receiver, function(err, results){
    if(err) return;
    if(results[0]) {
      var accept = results[0].privacy;
      var data = [receiver, sender, accept];
      const createFollow = followService.createFollow(data, function(err, results){
        if(err) return;
        if(results) return res.json({success: true, message: "팔로우 DB가 정상적으로 생성되었습니다."});
        return res.status(400).json({success: false, message: "팔로우 DB 생성에 실패하였습니다."});
      })
    } else {
      return res.json({success: false, message: "팔로우 DB 생성에 실패하였습니다."});
    }
  })
}

const unfollow = (req, res) => {
  var receiver = req.params.id;
  var sender = req.decoded.user_id;
  var data = [receiver, sender];

  const unfollow = followService.unfollow(data, function(err, results){
    if(results) {
      return res.json({success: true, message: "팔로우 DB 삭제 성공"});
    } else {
      return res.json({success: false, message: "팔로우 DB 삭제 실패"});
    }
  })
}

const followerList = (req, res) => {
  var user_id = req.params.id || req.decoded.user_id;
  
  const followerList = followService.followerList(user_id, function(err, results){
    if(results) {
      var list = [];
      for(var i=0; i<results.length; i++) {
        var user_id = JSON.stringify(results[i].follow_sender);
        list.push(user_id);
      }
      const followerInfo = followService.followerInfo(list, function(err, results){
        console.log(list);
        console.log(results);
        if(results) return res.json({success: true, message: "팔로워 목록 조회 성공", list: results});
        else return res.json({success: false, message: "팔로워 목록 조회 실패"});
      })
    } else {
      return res.json({success: false, message: "팔로워 목록 조회 실패"});
    }
  })
}

const followingList = (req, res) => {
  var user_id = req.params.id || req.decoded.user_id;
  
  const followingList = followService.followingList(user_id, function(err, results){
    if(results) {
      var list = [];
      for(var i=0; i<results.length; i++) {
        var user_id = JSON.stringify(results[i].follow_receiver);
        list.push(user_id);
      }
      const followingInfo = followService.followingInfo(list, function(err, results){
        console.log(list);
        console.log(results);
        if(results) return res.json({success: true, message: "팔로잉 목록 조회 성공", list: results});
        else return res.json({success: false, message: "팔로잉 목록 조회 실패"});
      })
    } else {
      return res.json({success: false, message: "팔로잉 목록 조회 실패"});
    }
  })
}

module.exports = {
  checkFollow,
  createFollow,
  unfollow,
  followerList,
  followingList,
}