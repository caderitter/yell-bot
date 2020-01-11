const Discord = require('discord.js');
const { joinChannelAndPlayFile } = require('./utils');
const { commandToFileMap } = require('./config');

const client = new Discord.Client();

client.on('ready', () => {
  console.log('i am ready');
});

client.on('message', message => {
  if (!message.guild) return;
  if (message.content && commandToFileMap[message.content]) {
    joinChannelAndPlayFile(message, `./assets/${commandToFileMap[message.content]}`)
  }
});

client.login(process.env.KEY);