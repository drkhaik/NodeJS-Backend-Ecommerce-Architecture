const amqp = require('amqplib');


const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        await channel.assertQueue(queueName, { durable: false });

        channel.consume(queueName, (message) => {
            console.log(`Consumer received message: ${message.content.toString()}`);
        }, {
            noAck: true // noAck: true: the message will be removed from the queue
        });
    } catch (err) {
        console.error(err);
    }
}

runConsumer().catch(console.error);