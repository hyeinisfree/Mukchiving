var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const getProfile = function(id, callback){
  var params = [id];
  var sql = 'select * from profiles where id = ?;';
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
  var params = data;
  var sql = 'update profiles set username = ?, content = ?, profile_image = ? where id = ?;';
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