var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const createPost = function(data, callback) {
  console.log(data);
  var params = data;
  var sql = 'insert into post(user_id, title, memo, location, score, created_at) values (?, ?, ?, ?, ?, now())';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

const detailPost = function(post_id, callback) {
  var params = [post_id];
  var sql = 'select * from post where post_id = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results)
  })
}

const profileImage = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select profile_image from profile where user_id = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results)
  })
}

module.exports = {
  createPost,
  detailPost,
  profileImage
}