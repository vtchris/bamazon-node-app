var Item = require("./objects.js");
var inquirer = require("inquirer");
var Table = require('cli-table');
var con = require('./sqlConnection.js');

const LINE = "\n--------------------------------------------------";

display_menu()

function display_menu() {

    console.log(LINE + '\nBamazon Mangement Module' + LINE)

    inquirer.prompt([
        {
            name: "menu",
            message: "Main Menu",
            type: "list",
            choices: ["View Items for Sale", "View Low Inventory", "View Sales Report", "Add Inventory", "Add New Item", "Add New Department"]
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
            case "View Sales Report":
                view_sales();
                break;
            case "Add New Department":
                add_department();
                break;
        }
    })

}
function display_inventory(sqlStr) {

    //console.log(con)
    //con.connect();
    var table = new Table({
        head: ['DEPT', 'ID', 'ITEM', 'COST', 'PRICE', 'MSRP', 'QTY']
        , colWidths: [15, 10, 20, 10, 10, 10, 10]
        , colAligns: [null, null, null, 'right', 'right', 'right', 'right']
    });

    con.query(sqlStr, function (err, results) {
        //console.log(con.threadId)
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
        //con.end();
        setTimeout(display_menu, 3000);
    })

}
function inventory_menu() {

    //Create list of inventory items
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

    //Select list of departments for use by the inquirer
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
                type: "number"
            },
            {
                message: "Enter unit price:",
                name: "price",
                type: "number"
            },
            {
                message: "Enter list price (MSRP):",
                name: "msrp",
                type: "number"
            },
            {
                message: "Enter staring inventory quantity:",
                name: "qty",
                type: "number"
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

            console.log(LINE + '\n' + response.name.toUpperCase() + ' Added!' + LINE);
            setTimeout(display_menu, 3000);

        })        
    })
}
function view_sales() {

    //Create table headers
    var table = new Table({
        head: ['DEPT ID', 'DEPT', 'EXPENSES', 'SALES', 'PROFIT']
        , colWidths: [10, 15, 10, 10, 10]
        , colAligns: [null, null, 'right', 'right', 'right']
    });

    //Create list of sales, using outer join to show departments without sales
    var sqlStr = "SELECT d.dept_id,d.dept_name,d.operating_expenses,"
        + "COALESCE(SUM(s.sale_total),0) AS sales, COALESCE(SUM(s.sale_total),0) - d.operating_expenses AS profit "
        + "FROM items AS i "
        + "LEFT OUTER JOIN departments AS d ON i.dept_id = d.dept_id "
        + "LEFT OUTER JOIN sales as s ON i.item_id = s.itm_id "
        + "GROUP BY d.dept_id,d.dept_name,d.operating_expenses ORDER BY d.dept_name";

    con.query(sqlStr, function (err, results) {
        if (err) { console.log(err) };
        //console.log(con.threadId)
        for (var i = 0; i < results.length; i++) {

            table.push(
                [results[i].dept_id,
                results[i].dept_name,
                parseFloat(results[i].operating_expenses).toFixed(2),
                parseFloat(results[i].sales).toFixed(2),
                parseFloat(results[i].profit).toFixed(2)
                ])

        }

        console.log(table.toString());

        setTimeout(display_menu, 3000);
    })

}
function add_department() {

    inquirer.prompt([
        {
            message: "Name of Department:",
            name: "name",
            type: "input"
        },
        {
            message: "Operating Expenses:",
            name: "expenses",
            type: "number"
        }
    ]).then(function (response) {

        con.query('INSERT INTO departments (dept_name,operating_expenses) VALUES (?,?)',
            [
                response.name.toUpperCase(),
                response.expenses
            ]
        );

        console.log("New Department Added!")
        setTimeout(display_menu, 3000);
    })
}