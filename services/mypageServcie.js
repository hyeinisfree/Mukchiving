var mysql = require('mysql');
var db = require('../db');

// 프로필 사진, 닉네임, 소개글, 포스트 수, 팔로잉 수, 팔로워 수 GET
const getInfo = function(id, callback) {
  var conn = db.init();
  db.connect(conn);
  var params = [id];
  var sql1 = 'select user_id from users where id = ?;';
  var sql1s = mysql.format(sql1, params);
  var sql2 = 'select * from profiles where id = ?;';
  var sql2s = mysql.format(sql2, params);
  var sql3 = 'select count(*) as post_count from posts where user_id = ?;';
  var sql3s = mysql.format(sql3, params);
  var sql4 = 'select count(*) as follower from follows where follow_receiver = ? and accept = 1; select count(*) as following from follows where follow_sender = ? and accept = 1;';
  var sql4s = mysql.format(sql4, [params, params]);
  conn.query(sql1s + sql2s + sql3s + sql4s, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    conn.end();
    callback(null, results);
  })
}


module.exports = {
  getInfo
}