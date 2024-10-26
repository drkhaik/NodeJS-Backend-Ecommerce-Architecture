const amqp = require('amqplib');

const messages = 'Hello, test send message from producer to consumer in microservice!';

const log = console.log;

console.log = function () {
    log.apply(console, [new Date()].concat(arguments));
}

// console.log("test", [new Date()].concat(arguments));

/*
2024-10-15T18:33:30.735Z [Arguments] {
  '0': 'test',
  '1': [
    2024-10-15T18:33:30.735Z,
    [Arguments] {
      '0': {},
      '1': [Function],
      '2': [Object],
      '3': '/Users/drkhaik/NodeJS-Backend-Architecture/ecommerce_backend_nodejs/src/tests/rabbitmq/producerDLX.js',
      '4': '/Users/drkhaik/NodeJS-Backend-Architecture/ecommerce_backend_nodejs/src/tests/rabbitmq'
    }
  ]
}
2024-10-15T18:33:30.791Z [Arguments] { '0': 'Producer send message: a new product' }
*/


const runProducerDLX = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEx'; // notification direct exchange
        const notificationQueue = 'notification_queue'; // assert queue
        const notificationDLX = 'notificationDLX'; // notification dead letter exchange
        const notificationRoutingKey = 'notificationRoutingKeyDLX'; // routing key
        
        // create Exchange
        await channel.assertExchange(notificationExchange, 'direct', { 
            durable: true 
        });

        // create Queue
        const queueResult = await channel.assertQueue(notificationQueue, {
            // durable: true,
            exclusive: false, // exclusive allow other connections to access the queue
            deadLetterExchange: notificationDLX,
            deadLetterRoutingKey: notificationRoutingKey
        })

        // bind queue to exchange
        await channel.bindQueue(queueResult.queue, notificationExchange);

        // send msg
        const msg = 'a new product'
        console.log(`Producer send message: ${msg}`);
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000' // 10s
        })    

        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    } catch (err) {
        console.error(err);
    }
}

runProducerDLX().catch(console.error);