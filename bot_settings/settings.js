/**
 * @file  botSettings.js - Core configuration and database connection.
 * @description A central place to manage all AURA bot's settings.
 */

// Import necessary libraries.
const { Sequelize } = require('sequelize');
const fs = require('fs');

// Check for a .env file and load environment variables if it exists.
// This allows you to store sensitive data like API keys and database URLs
// outside of your main codebase.
if (fs.existsSync('config.env')) {
    require('dotenv').config({ path: './config.env' });
}

// SQLite database file.
const DATABASE_URL = process.env.DATABASE_URL && process.env.DATABASE_URL.includes("postgres")
    ? process.env.DATABASE_URL
    : "./my_bot.db";

// Export all the bot's settings in a single object.
module.exports = {
    // The bot's version number.
    VERSION: '1.0.0',

    // The database URL used for the connection.
    DATABASE_URL: DATABASE_URL,

    // The Sequelize database object. This is what you will use to
    // interact with your database.
    DATABASE:
        DATABASE_URL === './my_bot.db'
            ? new Sequelize({ dialect: 'sqlite', storage: DATABASE_URL, logging: false })
            : new Sequelize(DATABASE_URL, {
                dialect: 'postgres',
                ssl: true,
                protocol: 'postgres',
                dialectOptions: { native: true, ssl: { require: true, rejectUnauthorized: false } },
                logging: false
            }),

    // The default language for the bot.
    LANGUAGE: process.env.LANGUAGE || 'EN',
    
    // The bot's timezone.
    TZ: process.env.TZ || 'Asia/Colombo',
    
    // You can add more settings here as your bot grows.
    BOT_NAME: 'AURA',
    BOT_PREFIX: '!'
};
