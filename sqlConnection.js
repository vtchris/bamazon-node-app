require("dotenv").config();
var keys = require("./keys");
var mysql = require('mysql');

const mySql_ID = keys.mysql.id;
const mySql_P = keys.mysql.p;



//DB Connection
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: mySql_ID,
    password: mySql_P,
    database: 'bamazon_db'//,
    //multipleStatements: true
  });
  
  // con.connect(function (err) {
  //   if (err) throw err;
  //   console.log("Connected!");
  // });
  module.exports = con