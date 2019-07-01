require("dotenv").config();
var mysql = require('mysql');
var keys = require("./keys");

const mySql_ID = keys.mysql.id;
const mySql_P = keys.mysql.p;

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: mySql_ID,
  password: mySql_P,
  database: 'bamazon_db',
  multipleStatements: true
  
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


    con.query('CALL sales_sellProduct_sp(1,1)', function(err) {
        console.log(err.sqlMessage);  
      });

