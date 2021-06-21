const db = require('../db');
const conn = db.init();

db.connect(conn);

const {userModel} = require('../models');

const userPrivacy = function(user_id, callback) {
  var params = [user_id];
  var sql = 'select privacy from user where user_id = ?';
  conn.query(sql, params, function(err, results) {
    if(err) {
      callback(err);
      return;
    }
    callback(null, results);
    return;
  })
}

const userTest = function() {
  var list = userModel.selectAll();
  return list;
}

module.exports = {
  userPrivacy,
  userTest
}