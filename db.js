const mysql = require('mysql');
const env = process.env.NODE_ENV || "development";
const config = require("./config/config")[env];

const db_info = {
  host : config.host,
  user : config.username,
  password : config.password,
  port : config.port,
  database : config.database,
  multipleStatements: true,
  dateStirng: 'date'
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