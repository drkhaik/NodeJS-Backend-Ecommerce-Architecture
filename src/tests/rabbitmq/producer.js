const amqp = require('amqplib');


const messages = 'hello, RabbitMQ for Ecommerce Server!';

const runProducer = async () => {
    try{
        const connection = await amqp.connect('amqp://guest:12345@localhost');
        const channel = await connection.createChannel();

        const queueName = "test-topic";
        await channel.assertQueue(queueName, {durable: false});

        // send message to consumer
        channel.sendToQueue(queueName, Buffer.from(messages));
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