require('dotenv').config();
const Discord = require('discord.js');
const {
  playFile,
  sendImage,
  createYellMap,
  createStickerMap,
  listCommands,
  postYell,
  postSticker,
  getAttachmentFromMessage
} = require('./utils');

let yellMap;
let stickerMap;

const client = new Discord.Client();

client.on('ready', async () => {
  yellMap = await createYellMap();
  stickerMap = await createStickerMap();
  console.log('i am ready');
});

client.on('message', async message => {
  if (!message.guild) return;
  const [firstArg, secondArg] = message.content.split(' ');

  if (yellMap[message.content]) {
    try {
      await playFile(message, yellMap[message.content]);
    } catch (e) {
      console.log('Yell failed to play: ' + e);
      return;
    }
  } else if (firstArg === 'sticker' && stickerMap[secondArg]) {
    try {
      await sendImage(message, stickerMap[secondArg]);
    } catch (e) {
      console.log('Sticker failed failed to send: ' + e);
    }
  } else {
    switch (firstArg) {
      case 'stopyell':
        if (message.member.voiceChannel) message.member.voiceChannel.leave();
        return;
      case 'listcommands':
        try {
          const [yellCommands, stickerCommands] = await listCommands();
          message.channel.send([
            'YELLS:',
            ...yellCommands,
            '',
            'STICKERS:',
            ...stickerCommands.map(c => `sticker ${c}`),
            '',
            'UTILS:',
            'postyell [name] -- this requires an attachment',
            'poststicker [name] -- this requires an attachment',
            'stopyell'
          ]);
        } catch (e) {
          message.reply('there was an error while fetching commands: ' + e);
        }
        return;
      case 'postyell':
        const attachment = getAttachmentFromMessage(message);
        try {
          await postYell(secondArg, attachment.url);
          message.reply(`yell ${secondArg} created.`);
        } catch (e) {
          message.reply('there was an error: ' + e);
        }
        return;
      case 'poststicker':
        const attachment = getAttachmentFromMessage(message);
        try {
          await postSticker(secondArg, attachment.url);
          message.reply(`sticker ${secondArg} created.`);
        } catch (e) {
          message.reply('there was an error: ' + e);
        }
        return;
      default:
        return;
    }
  }
});

client.login(process.env.DISCORD_API_KEY);
