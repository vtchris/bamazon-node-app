require("dotenv").config();
const Item = require("./objects.js")
var inquirer = require("inquirer");
var keys = require("./keys");
var mysql = require('mysql');
var Table = require('cli-table');
const RECEIPT = [];

const mySql_ID = keys.mysql.id;
const mySql_P = keys.mysql.p;

const itemsArr = [];

//DB Connection
var con = mysql.createConnection({
  host: "127.0.0.1",
  user: mySql_ID,
  password: mySql_P,
  database: 'bamazon_db',
  multipleStatements: true
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});


// con.query('CALL sales_sellProduct_sp(1,1)', function (err) {
//   console.log(err.sqlMessage);
// });

display_table()

//Display the table of items
function display_table(){

  var table = new Table({    
    head:['DEPT','ID','ITEM','PRICE','QTY']
    ,colWidths:[15,10,20,10,10]
    ,colAligns:[null,null,null,'right','right']
  });

  con.query("SELECT * FROM vw_itemlist",function(err,results){
        
    

    for(var i = 0;i < results.length;i++){

      let itemObj = new Item(results[i].item_id,results[i].itm_name,results[i].itm_cost,results[i].itm_msrp,results[i].itm_prc,results[i].itm_qty)

      table.push(
        [results[i].dept_name,
        itemObj.id,      
        itemObj.name,
        parseFloat(results[i].itm_prc).toFixed(2),
        results[i].itm_qty        
      ])
      
      itemsArr.push(itemObj)

    }
    
    console.log(table.toString());
    //console.log(itemsArr)
    select_item()

  })
}



function select_item(){
  let array = []
  
  for(var i = 0;i < itemsArr.length;i++){
    array.push(itemsArr[i].name)
  }

  inquirer.prompt([
  {
    name: "item",
    type: "list",    
    choices: [...array.sort()],
    pageSize:30   
  },{
    name: "quantity",
    type:"number",    
    message: "How many would you like?",
    default:1
  },
  {
    name:"continue",
    type:"confirm",
    message: "Would you like to purchase anything else?"    
  }
]).then(function(response){
 
    if(response.continue === true){
      select_item();
    }
    
  })

}
