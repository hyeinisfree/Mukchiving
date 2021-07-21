const db = require('../db');
const conn = db.init();

db.connect(conn);

const userPrivacy = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select privacy from users where id = ?';
  conn.query(sql, params, function(err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

module.exports = {
  userPrivacy,
}