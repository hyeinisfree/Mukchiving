var db = require('./db');
var conn = db.init();
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const { ExtractJwt } = passportJWT;
const LocalStrategy = require('passport-local').Strategy;

db.connect(conn);

const LocalStrategyOption = {
  usernameField: "user_id",
  passwordField: "password"
};
async function localVerify(user_id, password, done) {
  var user;
  try {
    var sql = 'select * from user where user_id = ?';
    var params = [user_id];
    await conn.query(sql, params, function (err, rows, fields) {
      if(err) {
        console.log(err);
        return done(null, false);
      }
      if(!rows[0]) return done(null, false);
      user = rows[0];

      const checkPassword = bcrypt.compare(password, user.password);
      if(!checkPassword) return done(null, false);

      console.log(user);
      return done(null, user);
    }); 
  } catch (e) {
    return done(e);
  }
}

const jwtStrategyOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'jwt-secret-key',
};
async function jwtVerift(payload, done) {
  var user;
  try {
    var sql = 'select * from user where user_id = ?';
    var params = [payload.user_id];
    await conn.query(sql, params, function (err, rows, fields) {
      if(!rows[0]) return done(null, false);
      user = rows[0];

      console.log(user);
      return done(null, user);
    });
  } catch (e) {
    return done(e);
  }
}

module.exports = () => {
  passport.use(new LocalStrategy(LocalStrategyOption, localVerify));
  passport.use(new JWTStrategy(jwtStrategyOption, jwtVerift));
};