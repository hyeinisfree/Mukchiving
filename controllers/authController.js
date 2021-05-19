var express = require('express');
var db = require('../db');
var conn = db.init();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const crypto = require('crypto-js');
const axios = require('axios');

db.connect(conn);

const { authService } = require('../services');

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
        const token = jwt.sign(
          { user_id : user.user_id },
          'jwt-secret-key',
          {expiresIn: "7d"}
        );
        return res.json({ success : true, message : "로그인 성공", token });
      });
    })(req, res);
  } catch (e) {
    console.error(e);
    return next(e);
  }
};

const checkUsername = (req, res) => {
  var username = req.body.username;
  const data = authService.checkUsername(username, function(err, data) {
    if(data) return res.status(400).json({success:false, message:"해당 닉네임이 이미 존재합니다."});
    return res.json({success:true, message:"이 닉네임은 사용 가능합니다."});
  });
};

const checkId = (req, res) => {
  var user_id = req.body.user_id;
  const data = authService.checkId(user_id, function(err, data) {
    if(data) return res.status(400).json({success:false, message:"해당 아이디가 이미 존재합니다."});
    return res.json({success:true, message:"이 아이디는 사용 가능합니다."});
  }); 
};

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
  var user_id = req.body.user_id;
  var password = req.body.password;
  var phone = req.body.phone;

  var username = req.body.username;

  var hash = await bcrypt.hash(password, saltRounds);
  var sql1 = 'insert into user (user_id, password, phone) values (?, ?, ?)';
  var params1 = [user_id, hash, phone];

  conn.query(sql1, params1, async function (err, rows, fields) {
    if(err) {
      return res.status(400).json({success: false, message: "회원 DB 생성에 실패하였습니다."});
    }
    console.log("user table 1 record inserted");

    var sql2 = 'insert into profile (user_id, username) values (?, ?)';
    var params2 = [user_id, username];
    await conn.query(sql2, params2, function (err, rows, fiedls) {
      if(err) {
        var sql3 = 'delete from user where user_id = ?';
        var params3 = [user_id];
        conn.query(sql3, params3, function (err, rows, fiedls) {
          if(err) {
            return next(err);
          }
          console.log("user table 1 record deleted");
        })
        return res.status(400).json({success: false, message: "프로필 DB 생성에 실패하였습니다."});
      }
      console.log("profile table 1 record inserted");
      return res.status(201).json({success: true, message: "회원 DB 및 프로필 DB가 정상적으로 생성되었습니다."});
    });
  }); 
};

const check =  (req, res) => {
  res.json(req.decoded);
};

module.exports = {
  login,
  checkUsername,
  checkId,
  sendAuthNumber,
  signup,
  check,
};