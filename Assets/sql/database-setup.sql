DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE 	departments(
				dept_id				INTEGER(11) AUTO_INCREMENT NOT NULL,
                dept_name			VARCHAR(40),
                operating_expenses	DECIMAL(13,2),
                PRIMARY KEY			(dept_id)
                );
                
INSERT INTO		departments (dept_name,operating_expenses)
VALUES			("BOOKS",500),
				("ELECTRONICS",1000),
                ("MOVIES",500),
                ("CLOTHING",750),
                ("TOYS");

CREATE TABLE products(
  item_id 		INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name	VARCHAR(100),
  dept_id		INTEGER(11),
  itm_cost		DECIMAL(13,2),
  itm_prc		DECIMAL(13,2),
  itm_msrp		DECIMAL(13,2),
  itm_qty		INTEGER(11),
  dt_added		DATETIME,
  PRIMARY KEY (item_id)
);

INSERT INTO 	products (product_name,	dept_id,itm_cost,itm_prc,itm_msrp,itm_qty,dt_added)
VALUES			("Gullivers Travels",1,5,7.5,8,'6/30/2019'),
				("JavaScript & JQuery",1,18,25.44,30,'6/30/2019'),
                ("iPad Mini",2,345,389,395,'6/30/2019'),
                ("Dell Laptop",2,900,1176,1300,'6/30/2019'),
                ("Avengers Infinity War",3,10,14.99,16,'6/30/2019'),
                ("Sherlock Holmes",3,5,9.99,12,'6/30/2019'),
                ("Mens Shirt",4,20,30,35,'6/30/2019'),
                ("Womens Shirt",4,18,26,30,'6/30/2019'),
                ("Shorts",4,20,25,28,'6/30/2019'),
                ("Catan",5,30,40,45,'6/30/2019'),
                ("Legos",5,20,25,26,'6/30/2019');	
                
CREATE TABLE  sales(
			  receipt_id 	INTEGER(11) AUTO_INCREMENT NOT NULL,
              dt_sold		DATETIME,
			  itm_id		INTEGER(11),
			  itm_cost		DECIMAL(13,2),
			  itm_prc		DECIMAL(13,2),
              qty_sold		INTEGER(11),
              sale_total	DECIMAL(13,2),		  
			  
			  PRIMARY KEY (receipt_id)
);

                