'use strict'

const { Client, GatewayIntentBits } = require('discord.js');

class LoggerService {
    constructor(){
        this.client = new Client({
            intents: [
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
    }
}

module.exports = new LoggerService();