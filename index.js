require('dotenv').config();
const Discord = require('discord.js');
const { handleMessage } = require('./handlers');

const client = new Discord.Client();

client.on('ready', () => console.log('i am ready'));

client.on('message', handleMessage);

client.login(process.env.DISCORD_API_KEY);
