const redisPubSubService = require('../services/redisPubsub.service');


class ProductServiceTest {
    purchaseProduct(product_id, quantity) {

        const order = {product_id, quantity};
        console.log("product_id: ", product_id);
        redisPubSubService.publish('purchase_events', JSON.stringify(order));
    }
}

module.exports = new ProductServiceTest();