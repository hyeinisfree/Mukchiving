require('dotenv').config();

const mysql = require('mysql');
const env = process.env.NODE_ENV || "development";
const config = require("./config/config")[env];

const db_info = {
  connectionLimit: 5000,
  host : config.host,
  user : config.username,
  password : config.password,
  port : config.port,
  database : config.database,
  multipleStatements: true,
  dateStirng: 'date'
}

const pool = mysql.createPool(db_info);

function init() {
  return mysql.createPool(db_info);
}

function connect(conn) {
  conn.getConnection(function(err, connection) {
    if(err) console.error('mysql connection error : ' + err);
    if(connection) return connection.release();
  });
}

module.exports = {
  init,
  connect
}