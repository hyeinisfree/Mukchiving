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

db.connect(conn);

router.get('/', (req, res) =>  {
  res.send(req.body);
});

router.post('/', passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
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
          'jwt-secret-key'
        );
        res.json({ token });
      });
    })(req, res);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/register/checkUsername', async (req, res, next) => {
  let username = req.body;
});

router.post('/register/checkId');

router.post('/register/checkPhone');

router.post('/register/checkPassword');

module.exports = router;