const { inventory } = require("../inventory.model");
const { Types } = require('mongoose');

const insertInventory = async ({
    product_id, 
    shop_owner, 
    stock, 
    location = 'unknown'
}) => {
    return await inventory.create({
        inven_product_id: product_id,
        inven_stock: stock,
        inven_shop_owner: shop_owner,
        inven_location: location
    })
}

module.exports = {
    insertInventory
}