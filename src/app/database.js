const mysql = require('mysql2')

const config = require('./config')

const connecitons = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD
})

connecitons.getConnection((err,conn) => {
conn.connect(err => {
 if(err) {
   console.log(`fail`,err);
 }
 else {
   console.log(`sucess`);
 }

})
})

module.exports = connecitons.promise()