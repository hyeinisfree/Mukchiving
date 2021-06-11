var mysql = require('mysql');
var db = require('../db');
var conn = db.init();
db.connect(conn);

const createFollow = async function(data, callback) {
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
  createFollow
}