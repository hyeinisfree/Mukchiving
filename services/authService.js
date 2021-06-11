var db = require('../db');
var conn = db.init();
db.connect(conn);

const checkUsername = function (username, callback) {
  var sql = 'select * from profile where username = ?';
  var params = [username];
  conn.query(sql, params, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results[0]);
  }); 
};

const checkId = function (user_id, callback) {
  var sql = 'select * from user where user_id = ?';
  var params = [user_id];
  conn.query(sql, params, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results[0]);
  })
}

module.exports = {
  checkUsername,
  checkId
}