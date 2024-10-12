const Redis = require('redis');

const redisClient = Redis.createClient();

(async () => {
    await redisClient.on('error', err => console.log('Redis Client Error', err))
        .connect();
})();

// const getClient = async () => {
//     client = await Redis.createClient().on('error', err => console.log('Redis Client Error', err))
//         .connect();
//     return client;
// }


class RedisPubSubService {
    constructor (){
        // this.publisher.connect();
        this.subscriber = redisClient.duplicate();
        // this.subscriber.connect();
        this.publisher = redisClient;
    }

    publish(channel, message) {
        return new Promise((resolve, reject) => {
            // this.publisher.connect();
            this.publisher.publish(channel, message, (err, reply) => {
                if(err) return reject(err);
                return resolve(reply);
            });
        })
    }

    subscribe(channel, callback){
        console.log("subscribing to channel: ", channel);
        this.subscriber.subscribe(channel);
        // this.subscriber.connect();
        console.log("ok");
        this.subscriber.on('message', (subscriberChannel, message) => {
            if(channel === subscriberChannel){
                callback(channel, message);
            }
        });
    }

    // subscribe(channel, callback) {
    //     return new Promise((resolve, reject) => {
    //         console.log("subscribing to channel: ", channel);
    //         this.subscriber.subscribe(channel, (err) => {
    //             if (err) {
    //                 console.error("Failed to subscribe to channel: ", channel);
    //                 reject(err);
    //             } else {
    //                 console.log("ok");
    //                 this.subscriber.on('message', (subscriberChannel, message) => {
    //                     if (channel === subscriberChannel) {
    //                         callback(channel, message);
    //                     }
    //                 });
    //                 resolve();
    //             }
    //         });
    //     });
    // }
}

module.exports = new RedisPubSubService();