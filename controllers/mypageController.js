var express = require('express');
var db = require('../db');
var conn = db.init();

var { mypageService } = require('../services');

// 프로필 사진, 닉네임, 소개글, 포스트 수, 팔로잉 수, 팔로워 수 GET
const info = (req, res) => {
  var id = req.params.id;
  console.log(id);
  const info = mypageService.getInfo(id, function(err, results) {
    if(results[0][0]) {
      console.log(results);
      const result = {
        id : results[1][0].id,
        user_id : results[0][0].user_id,
        username : results[1][0].username,
        profile_image : results[1][0].profile_image,
        content : results[1][0].content,
        post_count : results[2][0].post_count,
        follower : results[3][0].follower,
        following : results[4][0].following,
      };
      return res.json({success:true, message:"해당 유저 정보 반환 성공", info: result});
    } else {
      return res.status(400).json({success:false, message:"해당 유저의 정보가 존재하지 않습니다."});
    }
  });
};

module.exports = {
  info,
}