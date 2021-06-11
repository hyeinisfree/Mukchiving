var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const getProfile = function(user_id, callback){
  var params = [user_id];
  var sql = 'select * from profile where user_id = ?;';
  conn.query(sql, params, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const updateProfile = function(data, callback){
  console.log(data);
  var params = data;
  var sql = 'update profile set username = ?, content = ?, profile_image = ? where user_id = ?;';
  conn.query(sql, params, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

module.exports = {
  getProfile,
  updateProfile
}