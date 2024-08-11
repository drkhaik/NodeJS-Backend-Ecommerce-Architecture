'use strict'

const redis = require('redis');
const { promisify } = require('util'); // convert callback to promise, avoid callback hell
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

/*
    The acquireLock function uses Redis setnx (Set if Not eXists) to attempt to generate a unique lock 
    based on the product_id. If successful, we return that lock and continue processing. 
    If we can't generate a new lock, we pause for a moment and try again, ensuring that ONLY ONE CLIENT
    CAN ACCESS A PRODUCT AT A TIME.
*/

const acquireLock = async (product_id, quantity, cart_id) => {
    const key = `lock_v2024_${product_id}`;
    const retryTimes = 10;
    const expireTime = 3000; // 3s

    for (let i = 0; i < retryTimes.length; i++) {
        // create key, who get the key first can checkout first
        // if result = 1, then get the key, otherwise, try again
        const result = await setnxAsync(key, expireTime); 
        console.log('result', result);
        if(result === 1){
            // handle with inventory
            const isReserved = await reservationInventory({ product_id, cart_id, quantity });
            console.log("isReserved", isReserved);
            if(isReserved){
                // set expire time for key
                await pexpire(key, expireTime);
                return key; 
            }
            return null;
        }else{
            // wait for 50ms before try again
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
        
    }
};

const releaseLock = async (key) => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient);
    return await delAsyncKey(key);
};

module.exports = {
    acquireLock,
    releaseLock
}