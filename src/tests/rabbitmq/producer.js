const amqp = require('amqplib');


// const messages = 'hello, RabbitMQ for Ecommerce Server!';
const messages = 'Hello, test send message from producer to consumer in microservice!';

const runProducer = async () => {
    try{
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        // when you need to ensure that queues and messages in the queue are protected from loss, especially in applications that require high reliability.
        await channel.assertQueue(queueName, {durable: true});

        // send message to consumer
        channel.sendToQueue(queueName, Buffer.from(messages));
        // channel.sendToQueue(queueName, Buffer.from(messages), {
        //     persistent: true // ensure that messages are not lost even if the server is restarted
        // });
        console.log(`Producer send message: ${messages}`);
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500);

    }catch(err){
        console.error(err);
    }
}

runProducer().catch(console.error);