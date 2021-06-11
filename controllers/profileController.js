var express = require('express');
var db = require('../db');
var conn = db.init();

db.connect(conn);

var { authService, profileService } = require('../services');

const getProfile = (req, res) => {
  var user_id = req.params.id;
  const profile = profileService.getProfile(user_id, function(err, results) {
    if(results[0]) return res.json({success:true, message:"사용자 프로필 반환 성공", profile : results});
    return res.status(400).json({success:false, message:"해당 사용자의 프로필이 없습니다."});
  });
};

const updateProfile = (req, res, next) => {
  var user_id = req.decoded.user_id;

  var username = req.body.username;
    var content = req.body.content;
    var profile_image = req.body.profile_image;
    const checkUsername = authService.checkUsername(username, function(err, results) {
      if(results) return res.status(400).json({success:false, message:"해당 닉네임이 이미 존재합니다."});
      var data = [username, content, profile_image, user_id];
      const updateProfile = profileService.updateProfile(data, function(err, results) {
        if(results) return res.json({success:true, message:"사용자 닉네임, 소개글, 프로필 사진 수정 성공"});
        return res.json({success:false, message:"사용자 프로필 수정 실패"});
      });
    });
};

const uploadProfileImage = (req, res, next) => {
  const profile_image = req.file;
  return res.json({profile_image: profile_image.location});
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage
}
