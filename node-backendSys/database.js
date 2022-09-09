const mysql = require("mysql2");
const dbConnection = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"LnApi1"
}).promise()

module.exports = dbConnection
