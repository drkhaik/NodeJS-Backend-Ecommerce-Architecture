const redisPubSubService = require('../services/redisPubsub.service');


class InventoryServiceTest {
    constructor(){
        redisPubSubService.subscribe('purchase_events', (channel, message) => {
            console.log("Received message: ", message);
            InventoryServiceTest.updateInventory(message.product_id, message.quantity);
        });
    }

    static updateInventory (product_id, quantity){
        console.log(`Updated inventory ${product_id} with quantity ${quantity}`);
    }
}

module.exports = new InventoryServiceTest();