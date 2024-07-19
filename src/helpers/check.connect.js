'use strict'

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

// check count Connection
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections:`, numConnection);
}

// check overload
const checkOverload = () => {  
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connection based on number of cores
        const maxConnection = numCore * 5;

        console.log(`Active connections: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

        // console.log(`Num core: ${numCore}`);
        // console.log(`type: `, os.type());
        // console.log(`host name: `, os.hostname());

        if(numConnection > maxConnection){
            console.log(`Connection overload detected!`);
            // process.exit(1);
        }


    }, _SECONDS); // Monitor every 5 seconds
}


module.exports = {
    countConnect,
    checkOverload
};