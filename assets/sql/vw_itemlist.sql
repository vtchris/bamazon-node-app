CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `bamazon_db`.`vw_itemlist` AS select `bamazon_db`.`departments`.`dept_name` AS `dept_name`,`bamazon_db`.`items`.`item_id` AS `item_id`,`bamazon_db`.`items`.`itm_name` AS `itm_name`,`bamazon_db`.`items`.`itm_cost` AS `itm_cost`,`bamazon_db`.`items`.`itm_prc` AS `itm_prc`,`bamazon_db`.`items`.`itm_msrp` AS `itm_msrp`,`bamazon_db`.`items`.`itm_qty` AS `itm_qty` from (`bamazon_db`.`items` left join `bamazon_db`.`departments` on((`bamazon_db`.`items`.`dept_id` = `bamazon_db`.`departments`.`dept_id`))) order by `bamazon_db`.`departments`.`dept_name`,`bamazon_db`.`items`.`itm_name`;
SELECT * FROM bamazon_db.vw_itemlist;