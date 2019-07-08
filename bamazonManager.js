var Item = require("./objects.js");
var inquirer = require("inquirer");
var Table = require('cli-table');
var con = require('./sqlConnection.js')

//const itemsArr = [];
const LINE = "\n--------------------------------------------------";
//const RECEIPT = [];

// con.connect(function(err) {
//     if (err) throw err;
//     console.log("connected as id " + con.threadId);
//     con.end();
//   });

display_menu()

function display_menu() {

    console.log(LINE)

    inquirer.prompt([
        {
            name: "menu",
            message: "Main Menu",
            type: "list",
            choices: ["View Items for Sale", "View Low Inventory", "Add Inventory", "Add New Item"]
        }
    ]).then(function (response) {
        switch (response.menu) {
            case "View Items for Sale":
                display_inventory("SELECT * FROM vw_itemlist");
                break;
            case "View Low Inventory":
                display_inventory("SELECT * FROM vw_itemlist WHERE itm_qty < 6");
                break;
            case "Add Inventory":
                inventory_menu();
                break;
            case "Add New Item":
                add_newItem();
                break;

        }
    })

}
function display_inventory(sqlStr) {

    //con.connect();
    var table = new Table({
        head: ['DEPT', 'ID', 'ITEM', 'COST', 'PRICE', 'MSRP', 'QTY']
        , colWidths: [15, 10, 20, 10, 10, 10, 10]
        , colAligns: [null, null, null, 'right', 'right', 'right', 'right']
    });

    con.query(sqlStr, function (err, results) {
        console.log(con.threadId)
        for (var i = 0; i < results.length; i++) {

            table.push(
                [results[i].dept_name,
                results[i].item_id,
                results[i].itm_name,
                parseFloat(results[i].itm_cost).toFixed(2),
                parseFloat(results[i].itm_prc).toFixed(2),
                parseFloat(results[i].itm_msrp).toFixed(2),
                results[i].itm_qty
                ])

        }

        console.log(table.toString());

        setTimeout(display_menu, 3000);
    })

}
function inventory_menu() {

    con.query("SELECT item_id, itm_name FROM items", function (err, results) {

        let array = [];

        for (var i = 0; i < results.length; i++) {
            array.push(results[i].item_id + ": " + results[i].itm_name)
        }

        inquirer.prompt([
            {
                name: "item",
                message: "Select Item to Add Inventory",
                type: "list",
                choices: array
            },
            {
                message: "Enter quantity to Add to inventory:",
                name: "quantity",
                type: "number"
            }
        ]).then(function (response) {

            let index = response.item.indexOf(":");
            let item_id = response.item.substring(0, index);

            con.query('UPDATE items SET itm_qty = itm_qty + ? WHERE item_id =' + item_id, [response.quantity]);

            display_inventory("SELECT * FROM vw_itemlist");

            console.log(LINE + "\nInventory Adjusted " + LINE)



        })

    })

}
function add_newItem() {

    con.query("SELECT dept_id, dept_name FROM departments", function (err, results) {

        let array = [];

        for (var i = 0; i < results.length; i++) {
            array.push(results[i].dept_id + ": " + results[i].dept_name)
        }

        inquirer.prompt([
            {
                message: "Name of item:",
                name: "name",                
                type: "input"
            },
            {
                choices: array,
                message: "Select Department:",
                name: "dept",
                type: "list"                
            },
            {
                message: "Enter unit cost:",
                name: "cost",
                type:"number"
            },
            {
                message: "Enter unit price:",
                name: "price",
                type:"number"
            },
            {
                message: "Enter list price (MSRP):",
                name: "msrp",
                type:"number"
            },
            {
                message: "Enter staring inventory quantity:",
                name: "qty",
                type:"number"
            }
        ]).then(function (response) {

            let index = response.dept.indexOf(":");
            let dept_id = response.dept.substring(0, index);

            con.query('INSERT INTO items (itm_name,dept_id,itm_cost,itm_prc,itm_msrp,itm_qty,dt_added) VALUES (?,?,?,?,?,?,NOW()) ', 
            [
                response.name,
                dept_id,
                response.cost,
                response.price,
                response.msrp,
                response.qty
            ]);

            console.log(LINE+'\n' + response.name.toUpperCase() + ' Added!' + LINE);

        })

    })
}

