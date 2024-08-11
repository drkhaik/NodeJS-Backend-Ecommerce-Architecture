const { convertToObjectId } = require("../../utils");
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

const reservationInventory = async ({
    product_id,
    cart_id,
    quantity
}) => {
    const query = {
        inven_product_id: convertToObjectId(product_id),
        inven_stock: {$gte: quantity}, // greater than or equal quantity
    },
    updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cart_id,
                createAt: new Date()
            }
        }
    },
    options = { new: true, upsert: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
}

module.exports = {
    insertInventory,
    reservationInventory
}