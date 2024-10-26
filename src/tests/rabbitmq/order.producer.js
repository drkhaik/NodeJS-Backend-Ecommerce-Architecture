'use strict'

const amqp = require('amqplib');

async function producerOrderedMessage(){
    const connection = await amqp.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();

    const queueName = "order-queue";
    // when you need to ensure that queues and messages in the queue are protected from loss, especially in applications that require high reliability.
    await channel.assertQueue(queueName, { durable: true });

    for (let i = 0; i < 10; i++) {
        const message = `Order message ${i}`;
        console.log(`Producer send message: ${message}`);
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true // ensure that messages are not lost even if the server is restarted
        });
    }   

    setTimeout(() => {
        connection.close();
    }, 1000);
}

producerOrderedMessage().catch( err => console.error(err));