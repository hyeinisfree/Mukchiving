const mysql = require('mysql');
const db_config = require('./config/db-config.json');

const connection = mysql.createConnection({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  port: db_config.port,
  database: db_config.database
});

function getAllUsers(callback) {
  connection.query(`select * from user`, (err, rows, fields) => {
    if(err) throw err;
    callback(rows);
  });
}

module.exports = {
  getAllUsers
}