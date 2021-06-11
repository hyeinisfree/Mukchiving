const db = require('../db');
const conn = db.init();

db.connect(conn);

const userPost = function(user_id, callback){
  var params = [user_id];
  var sql = 'select * from post where user_id = ?;';
  conn.query(sql, params, function (err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  });
};

module.exports = {
  userPost
}