'use strict'
const mongoose = require('mongoose');
const { db: { connectionStr }} = require('../configs/config.mongodb');
const connectStr = `${connectionStr}`;
const { countConnect } = require('../helpers/check.connect');

class Database {
    constructor(){
        this.connect();
    }

    connect(type = 'mongodb'){
        if (1 === 1) {
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true});
        }

        mongoose.connect(connectStr, {
            maxPoolSize: 50,
        }).then( _ => {
            console.log(`Connected MongoDB Success`);
            countConnect();
        })
        .catch( err => console.log(`Error Connect`))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database();
        }

        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;