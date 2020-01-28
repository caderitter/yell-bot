require('dotenv').config();
const Discord = require('discord.js');
const { playFile, createCommandMap } = require('./utils');

let commandMap;

const client = new Discord.Client();

client.on('ready', async () => {
  commandMap = await createCommandMap();
  console.log('i am ready');
});

client.on('message', async message => {
  if (!message.guild) return;
  if (commandMap[message.content]) {
    playFile(message, commandMap[message.content])
  } else {
    switch (message.content) {
      case 'updatecommands': 
        try {
          commandMap = await createCommandMap();
          message.reply('commands updated from airtable!');
        } catch (e) {
          message.reply('there was an error while updating commands: ' + e);
        }
      case 'stop':
        message.member.voiceChannel.leave();
      default:
        return;
    }
  }
});

client.login(process.env.DISCORD_API_KEY);
