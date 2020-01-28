require('dotenv').config();
const Discord = require('discord.js');
const { playFile, updateCommands } = require('./utils');

let commandMap;

const client = new Discord.Client();

client.on('ready', async () => {
  commandMap = await updateCommands();
  console.log('i am ready');
});

client.on('message', async message => {
  if (!message.guild) return;
  if (commandMap[message.content]) {
    playFile(message, commandMap[message.content])
  } else {
    switch (message.content) {
      case 'updatecommands': 
        commandMap = await updateCommands();
        m.reply('commands updated from airtable!');
      default:
        return;
    }
  }
});

client.login(process.env.DISCORD_API_KEY);
