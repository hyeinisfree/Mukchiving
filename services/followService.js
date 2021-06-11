var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const checkFollow = function(data, callback) {
  var params = data;
  var sql = 'select * from follow where follow_receiver = ? and follow_sender = ?';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const createFollow = function(data, callback) {
  var params = data;  
  var sql = 'insert into follow(follow_receiver, follow_sender, created_at, accept) values (?, ?, now(), ?)';
  conn.query(sql, params, function(err, results){
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

module.exports = {
  checkFollow,
  createFollow
}