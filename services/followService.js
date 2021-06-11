var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const createFollow = function(data, callback) {
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

module.exports = {
  createFollow
}