var express = require('express');
var db = require('../db');
var conn = db.init();

db.connect(conn);

var { authService, profileService } = require('../services');

const { Op } = require("sequelize");
const { sequelize } = require("../models");
const User = require("../models/user");
const Profile = require("../models/profile");

const getProfile = (req, res) => {
  var id = req.params.id;

  Profile.findOne({where: {id: id}})
  .then(profile => {
    if(profile != null) return res.json({success:true, message:"사용자 프로필 반환 성공", profile : profile});
    else return res.status(400).json({success:false, message:"해당 사용자의 프로필이 없습니다."});
  }).catch(err => {
    return next(err);
  })
};

const updateProfile = (req, res, next) => {
  var id = req.decoded.id;
  
  const profile = profileService.getProfile(id, async function(err, results) {
    if(results[0]) {
      var data = [];
      data.push(results[0].username);
      data.push(results[0].content);
      data.push(results[0].profile_image);
      data.push(id);

      if(req.body.username) {
        data[0] = req.body.username;
        const checkUsername = authService.checkUsername(req.body.username, function(err, results) {
          if(results) return res.status(400).json({success:false, message:"해당 닉네임이 이미 존재합니다."}); 
        });
      }
      if(req.body.content) data[1] = req.body.content;
      if(req.body.profile_image) data[2] = req.body.profile_image;
    
      const updateProfile = await profileService.updateProfile(data, function(err, results) {
        if(results) return res.json({success:true, message:"사용자 닉네임, 소개글, 프로필 사진 수정 성공"});
        return res.json({success:false, message:"사용자 프로필 수정 실패"});
      });
    } else {
      return res.status(400).json({success:false, message:"해당 사용자의 프로필이 없습니다."});
    }
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
