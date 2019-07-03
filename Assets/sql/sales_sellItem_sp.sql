DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sales_sellItem_sp`()
BEGIN

SELECT 	itm_qty
INTO 	@itm_start_qty
FROM 	items
WHERE 	item_id = itm_id;

IF sale_qty > @itm_start_qty THEN
	
	SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Insufficient Inventory to complete transaction.';
END IF;

SELECT  itm_cost,itm_prc
INTO 	@itm_cost,@itm_prc
FROM	items
WHERE 	item_id = itm_id;

INSERT INTO sales (dt_sold,itm_id,itm_cost,itm_prc,qty_sold,sale_total)
VALUES	(	NOW(),
			itm_id,
			@itm_cost,
            @itm_prc,
            sale_qty,
            sale_qty * @itm_prc	);
            
UPDATE 	items
SET 	itm_qty = itm_qty - sale_qty
WHERE	item_id = itm_id;


END$$
DELIMITER ;
