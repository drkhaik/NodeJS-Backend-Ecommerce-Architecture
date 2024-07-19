'use strict'

const dev = {
    app: {
        port: process.env.DEV_APP_PORT
    },
    db: {
        // host: process.env.DEV_DB_HOST,
        // port: process.env.DEV_DB_PORT,
        // name: process.env.DEV_DB_NAME
        connectionStr: process.env.DEV_DB_CONNECTION_STR
    }
}


const pro = {
    app: {
        port: process.env.PRO_APP_PORT
    },
    db: {
        // host: process.env.PRO_DB_HOST,
        // port: process.env.PRO_DB_PORT,
        // name: process.env.PRO_DB_NAME
        connectionStr: process.env.PRO_DB_CONNECTION_STR
    }
}

const config = { dev, pro}
const env = process.env.NODE_ENV || 'dev';
module.exports = config[env];