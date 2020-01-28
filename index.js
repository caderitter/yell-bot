require('dotenv').config();
const Discord = require('discord.js');
const { playFile, handleMessage, updateCommands } = require('./utils');

let commandMap; 

const client = new Discord.Client();

client.on('ready', async () => {
  console.log('updating commands from airtable...');
  commandMap = await updateCommands();
  console.log('i am ready');
});

client.on('message', async message => {
  if (!message.guild) return;
  if (commandMap[message.content]) playFile(message, commandMap[message.content]);
  handleMessage({
    'updatecommands': async m => {
      commandMap = await updateCommands();
      m.reply('commands updated from airtable!');
    },
    'calling all gamers': m => m.reply('i\'m a gamer'),
  })(message);
});

client.login(process.env.DISCORD_API_KEY);
