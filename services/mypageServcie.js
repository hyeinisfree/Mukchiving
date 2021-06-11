var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

// 프로필 사진, 닉네임, 소개글, 포스트 수, 팔로잉 수, 팔로워 수 GET
const getInfo = function(user_id, callback) {
  var params = [user_id];
  var sql1 = 'select * from profile where user_id = ?;';
  var sql1s = mysql.format(sql1, params);
  var sql2 = 'select count(*) as post_count from post where user_id = ?;';
  var sql2s = mysql.format(sql2, params);
  var sql3 = 'select count(*) as follower from follow where follow_receiver = ? and accept = 1; select count(*) as following from follow where follow_sender = ? and accept = 1;';
  var sql3s = mysql.format(sql3, [params, params]);
  conn.query(sql1s + sql2s + sql3s, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
  })
}

module.exports = {
  getInfo
}