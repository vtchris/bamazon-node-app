require("dotenv").config();
var Item = require("./objects.js");
var inquirer = require("inquirer");
var keys = require("./keys");
var mysql = require('mysql');
var Table = require('cli-table');

const itemsArr = [];
const LINE = "\n--------------------------------------------------";
const mySql_ID = keys.mysql.id;
const mySql_P = keys.mysql.p;
const RECEIPT = [];

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

display_table();

//Display the table of items
function display_table() {

  itemsArr.length = 0
  console.log("\nWELCOME TO BAMAZON!")

  var table = new Table({
    head: ['DEPT', 'ID', 'ITEM', 'PRICE', 'QTY']
    , colWidths: [15, 10, 20, 10, 10]
    , colAligns: [null, null, null, 'right', 'right']
  });

  con.query("SELECT * FROM vw_itemlist WHERE itm_qty > 0", function (err, results) {

    for (var i = 0; i < results.length; i++) {

      let itemObj = new Item(results[i].item_id, results[i].itm_name, results[i].itm_cost, results[i].itm_msrp, results[i].itm_prc, results[i].itm_qty);

      table.push(
        [results[i].dept_name,
        itemObj.id,
        itemObj.name,
        parseFloat(results[i].itm_prc).toFixed(2),
        results[i].itm_qty
        ])

      itemsArr.push(itemObj);

    }

    console.log(table.toString());

    setTimeout(select_item, 3000);
    //select_item();

  })
}

function select_item() {

  let array = [];

  //Create list of items with inventory
  for (var i = 0; i < itemsArr.length; i++) {
    array.push(itemsArr[i].name)
  }

  inquirer.prompt([
    {
      name: "item",
      message:"Select item to purchase:",
      type: "list",
      choices: [...array.sort()],
      pageSize: 30
    }, {
      name: "quantity",
      type: "number",
      message: "How many would you like?",
      default: 1
    },
    {
      name: "continue",
      type: "confirm",
      message: "Would you like to complete the sale?"
    }
  ]).then(function (response) {
        
    if (response.continue === false) {

      console.log(LINE + "\nTRANSACTION CANCELLED" + LINE);

      select_item();
      return;

    } 
    if (isNaN(response.quantity)) {

      console.log(LINE + "TRANSACTION CANCELLED, INVALID QUANTITY" + LINE);

      select_item();
      return;

    }

    let item = findItemByProperty(itemsArr, 'name', response.item)

    //Make sure there is enough inventory
    if (item.qty >= response.quantity) {

      item.qty_selected = response.quantity;
      RECEIPT.push(item);

      if (response.continue === true) {
        console.log("\nCompleting Sale...\n")
        con.query("CALL sales_sellItem_sp(?,?)", [item.id, item.qty_selected], function (err, results) {
          if (err) {
            console.log(err);
          }

          display_receipt(results[0][0]['LAST_INSERT_ID()']);

        });

        select_item();

      } else {

        display_receipt();

      }

    } else {

      console.log(LINE + "\nSorry, we do not have enough inventory to fill this request." + LINE)
      select_item();

    }

  })

}
function display_receipt(recptNbr) {

  let table = new Table({
    head: ['ITEM', 'QTY', 'PRICE', 'EXT']
    , colWidths: [15, 10, 10, 10]
    , colAligns: [null, 'right', 'right', 'right']
    , chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
  });

  console.log(LINE);
  console.log("Receipt: " + recptNbr);
  for (var i = 0; i < RECEIPT.length; i++) {

    table.push(
      [RECEIPT[i].name,
      RECEIPT[i].qty_selected,
      parseFloat(RECEIPT[i].price).toFixed(2),
      parseFloat(RECEIPT[i].price * RECEIPT[i].qty_selected).toFixed(2)

      ])
  }
  console.log(table.toString());

  let savings = (RECEIPT[0].qty_selected * RECEIPT[0].msrp) - (RECEIPT[0].qty_selected * RECEIPT[0].price);

  if (savings > 0) {
    console.log("\nYou have saved " + parseFloat(savings).toFixed(2) + "!");
  }

  console.log("Thank you for shopping at Bamazon!" + LINE + "\n");

  setTimeout(display_table, 5000);
}

function findItemByProperty(array, property, value) {
  for (var i = 0; i < array.length; i++) {
    if (array[i][property] === value) {
      return array[i];
    }
  }
  return [-1];
}
