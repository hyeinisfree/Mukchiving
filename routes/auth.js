var express = require('express');
var router = express.Router();
var db = require('./../db');
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

router.get('/', (req, res) =>  {
  res.send(req.body);
});

router.post('/', passport.authenticate('jwt', { session: false }), 
  (req, res, next) => {
    try {
      res.json({result:true});
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
);

router.post('/login', async (req, res, next) => {
  try {
		// 아까 local로 등록한 인증과정 실행
    passport.authenticate('local', { session: false }, (err, user) => {
			// 인증이 실패했거나 유저 데이터가 없다면 에러 발생
      if (err || !user) {
        console.log(err);
        res.status(400).json({ message: err });
        return;
      }
			// user데이터를 통해 로그인 진행
      req.login(user, { session: false }, (err) => {
        if (err) {
          console.log(err);
          res.send(err);
          return;
        }
		    // 클라이언트에게 JWT생성 후 반환
        const token = jwt.sign(
          { user_id: user.user_id },
          'jwt-secret-key',
          {expiresIn: "7d"}
        );
        res.json({ token });
      });
    })(req, res);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/checkUsername', (req, res) => {
  var username = req.body.username;
  var sql = 'select * from user where username = ?';
  var params = [username];
  conn.query(sql, params, function (err, rows, fields) {
    if(err) {
      console.log(err);
    }
    if(rows) res.send({check:false});
    res.send({check:true});
  }) 
});

router.post('/checkId', (req, res) => {
  var user_id = req.body.user_id;
  var sql = 'select * from user where user_id = ?';
  var params = [user_id];
  conn.query(sql, params, function (err, rows, fields) {
    if(err) {
      console.log(err);
    }
    if(rows) res.send({check:false});
    res.send({check:true});
  }) 
});

router.post('/sendAuthNumber', async (req, res) => {
  var phone = req.body.phone;
  var auth_number = req.body.auth_number;
  var resultCode = 404;

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
  .then(async (res) =>  {
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
  res.json({'code' : resultCode});
});

router.post('/register', async (req, res) => {
  var user_id = req.body.user_id;
  var password = req.body.password;
  var phone = req.body.phone;

  var username = req.body.username;

  var hash = await bcrypt.hash(password, saltRounds);
  var sql1 = 'insert into user (user_id, password, phone) values (?, ?, ?)';
  var params1 = [user_id, hash, phone];

  conn.query(sql1, params1, async function (err, rows, fields) {
    if(err) throw err;
    console.log("1 record inserted");

    var sql2 = 'insert into profile (user_id, username) values (?, ?)';
    var params2 = [user_id, username];
    await conn.query(sql2, params2, function (err, rows, fiedls) {
      if(err) throw err;
      console.log("1 record inserted");
    });
    return res.status(200).json({success: 'true'});
  }); 
});

router.get('/check', (req, res) => {
  // 인증 확인
  const token = req.headers.authorization.split('Bearer ')[1];
  let jwt_secret = 'jwt-secret-key';

  if (!token) {
    res.status(400).json({
      'status': 400,
      'msg': 'Token 없음'
    });
  }
  const checkToken = new Promise((resolve, reject) => {
    jwt.verify(token, jwt_secret, function (err, decoded) {
      if (err) reject(err);
      resolve(decoded);
    });
  });

  checkToken.then(
    token => {
      console.log(token);
      res.status(200).json({
        'status': 200,
        'msg': 'success',
        token
      });
    }
  )
});

router.post('/logout', passport.authenticate('jwt', { session: false }), 
  (req, res) => {
    try {
      req.logout();
      res.send('hello');
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
);

module.exports = router;