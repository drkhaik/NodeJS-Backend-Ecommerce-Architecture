'use strict'

const amqp = require('amqplib');

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = "order-queue";
    await channel.assertQueue(queueName, { durable: true });

    // set prefetch to 1 to ensure that the consumer only processes one message at a time
    channel.prefetch(1); // 1 means 1 message at a time
    /*
        Processed message: Order message 9  => Processed message: Order message 0
        Processed message: Order message 8  => Processed message: Order message 1
        Processed message: Order message 2  => Processed message: Order message 2
        Processed message: Order message 0  => Processed message: Order message 3
        Processed message: Order message 6  => Processed message: Order message 4
        Processed message: Order message 1  => Processed message: Order message 5
        Processed message: Order message 4  => Processed message: Order message 6
        Processed message: Order message 5  => Processed message: Order message 7
        Processed message: Order message 3  => Processed message: Order message 8
        Processed message: Order message 7  => Processed message: Order message 9
    */

    channel.consume(queueName, (message) => {
        // simulate process of order, each order has different processing
        setTimeout(() => {
            console.log(`Processed message: ${message.content.toString()}`);
            channel.ack(message);
        }, Math.random() * 1000); // msg 1 process 3s, msg 2 process 1s, msg 3 process 2s
    }, {
        noAck: false // noAck: true: the message will be removed from the queue
    });


}

consumerOrderedMessage().catch(err => console.error(err));