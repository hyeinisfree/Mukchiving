require('dotenv').config();

var express = require('express');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const axios = require('axios');

const { Op } = require("sequelize");
const { sequelize } = require("../models");
const User = require("../models/user");
const Profile = require("../models/profile");
const Token = require("../models/profile");

const { authService } = require('../services');
const { WorkDocs } = require('aws-sdk');

const login =  async (req, res, next) => {
  try {
		// 아까 local로 등록한 인증과정 실행
    passport.authenticate('local', { session: false }, (err, user) => {
			// 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (err || !user) {
        console.log(err);
        return res.status(400).json({success : false, message : "로그인 실패"});
      }
			// user 데이터를 통해 로그인 진행
      req.login(user, { session: false }, (err) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }
		    // 클라이언트에게 JWT생성 후 반환
        const accessToken = jwt.sign(
          { id: user.id, user_id : user.user_id },
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn : "1h"}
        );
        const refreshToken = jwt.sign(
          { },
          process.env.REFRESH_TOKEN_SECRET,
          {expiresIn : "14d"}
        );
        
        Token.create({id:user.id, token:refreshToken})
        .then(function(result) {
          console.log(result);
          console.log("tokens table 1 record inserted");
        }).catch(function(err) {
          return res.status(400).json({success: false, message: "회원 DB 생성에 실패하였습니다."});
        });

        return res.json({ success : true, message : "로그인 성공", accessToken, refreshToken });
      });
    })(req, res);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const checkUsername = (req, res) => {
  var username = req.params.username;
  Profile.findOne({where: {username: username}})
  .then(profile => {
    if(profile != null) return res.status(400).json({success:false, message:"해당 닉네임이 이미 존재합니다."});
    else return res.json({success:true, message:"이 닉네임은 사용 가능합니다."});
  }).catch(err => {
    return next(err);
  })
};

const checkId = (req, res) =>  {
  var user_id = req.params.id;
  User.findOne({where: {user_id: user_id}})
  .then(user => {
    if(user != null) return res.status(400).json({success:false, message:"해당 아이디가 이미 존재합니다."});
    else return res.json({success:true, message:"이 아이디는 사용 가능합니다."});
  }).catch(err => {
    return next(err);
  });
}

const sendAuthNumber =  async (req, res) => {
  var phone = req.body.phone;
  var auth_number = '';
  var resultCode = 404;

  for(var i=0; i<6; i++) {
    var rnum = Math.floor(Math.random() * 10);
    auth_number += rnum;
  }
  console.log(auth_number);

  const accessKey = 'rKFKX9FhZBZz8UUOGOn8';
  const secretKey = 'BxmlIkcd5LsYp406VisBMB3FltpZ6oVgYaNi6zOy';
  const serviceID = 'ncp:sms:kr:259842340497:mukchiving';
  const myphone = '01084071066';
  const space = " ";
  const newLine = "\n";
  const method = "POST";

  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${serviceID}/messages`;
  const url2 = `/sms/v2/services/${serviceID}/messages`;

  const date = Date.now().toString();
  var hmac=crypto.algo.HMAC.create(crypto.algo.SHA256,secretKey);
  hmac.update(method);
	hmac.update(space);
	hmac.update(url2);
	hmac.update(newLine);
	hmac.update(date);
	hmac.update(newLine);
	hmac.update(accessKey);
  const hash = hmac.finalize();
	const signature = hash.toString(crypto.enc.Base64);
  
  const body = {
    "type":"SMS",
    "contentType":"COMM",
    "countryCode":"82",
    "from": myphone,
    "content":`Mukchinving 인증번호는 ${auth_number} 입니다.`,
    "messages":[
        {
          "to": phone
        }
    ]
  }
  const options = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-iam-access-key' : accessKey,
      'x-ncp-apigw-timestamp': date,
      'x-ncp-apigw-signature-v2': signature
    }  
  }
  await axios.post(url, body, options)
  .then((res) =>  {
    resultCode = 200;
  })
  .catch((error) => {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
  if(resultCode == 200) return res.status(resultCode).json({success: true, message: "인증 번호 전송 성공", auth_number: auth_number});
  else return res.status(resultCode).json({success: false, message: "인증 번호 전송 실패"});
};

const signup =  async (req, res) => {
  console.log(req.body);
  var user_id = req.body.user_id;
  var password = req.body.password;
  var phone = req.body.phone;
  var username = req.body.username;

  var hash = await bcrypt.hash(password, saltRounds);

  User.create({user_id:user_id, password:hash, phone:phone})
  .then(async function(result) {
    console.log(result);
    console.log("users table 1 record inserted");

    await Profile.create({id:result.id, username:username})
    .then(function(result) {
      console.log(result);
      console.log("profile table 1 record inserted");

      return res.status(201).json({success: true, message: "회원 DB 및 프로필 DB가 정상적으로 생성되었습니다."});
    }).catch(function(err) {
      User.destroy({where: {id:id}})
      .then(function(result) {
        console.log("user table 1 record deleted");
        return res.status(400).json({success: false, message: "프로필 DB 생성에 실패하였습니다."});
      }).catch(function(err) {
        return next(err);
      });
    });
  }).catch(function(err) {
    return res.status(400).json({success: false, message: "회원 DB 생성에 실패하였습니다."});
  });
};

module.exports = {
  login,
  checkUsername,
  checkId,
  sendAuthNumber,
  signup,
};