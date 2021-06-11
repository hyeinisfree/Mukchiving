const mysql = require('mysql');
const db_config = require('./config/db-config.json')

const db_info = {
  host : db_config.host,
  user : db_config.user,
  password : db_config.password,
  port : db_config.port,
  database : db_config.database,
  multipleStatements: true
}

const connection = mysql.createConnection(db_info);

function init() {
  return mysql.createConnection(db_info);
}

function connect(conn) {
  conn.connect(function(err) {
    if(err) console.error('mysql connection error : ' + err);
    else console.log('mysql is connected successfully!');
  });
}

module.exports = {
  init,
  connect
}