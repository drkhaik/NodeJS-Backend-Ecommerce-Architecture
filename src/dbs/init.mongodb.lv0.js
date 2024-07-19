'use strict'

const mongoose = require('mongoose');

const { db: { connectionStr } } = require('../configs/config.mongodb');
const connectStr = `${connectionStr}`;

mongoose.connect(connectStr).then( _ => console.log(`Connected MongoDB Success`))
.catch( err => console.log(`Error Connect`))

// dev
if(1 === 0){
    mongoose.set('debug', true);
    mongoose.set
}