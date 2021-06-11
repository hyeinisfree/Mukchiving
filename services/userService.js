const db = require('../db');
const conn = db.init();

db.connect(conn);

const userPost = function(user_id, callback){

};

module.exports = {
  userPost
}