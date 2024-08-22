'use strict'

require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const {
    DISCORD_CHANNEL_ID,
    TOKEN_DISCORD_LOG_BOT
} = process.env;

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

        // add ChannelId
        this.channelId = DISCORD_CHANNEL_ID

        this.client.on('ready', () => {
            console.log(`Logged is as ${this.client.user.tag}`);
        })

        this.client.login(TOKEN_DISCORD_LOG_BOT);
    }

    sendToMessage = (message) => {
        const channel = this.client.channels.cache.get(this.channelId);
        if(!channel) {
            console.error('Channel not found!', this.channelId);
            return;
        }

        channel.send(message).catch(e => console.error(e));
    }

    sendToFormatCode(logData) {
        const { code, message = "This is some additional information about the code.", title = "Code Example" } = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '```',
                    color: 0x00ff00
                }
            ]
        }

        this.sendToMessage(codeMessage);
    }

}

module.exports = new LoggerService();