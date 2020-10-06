require('dotenv').config();
const Discord = require('discord.js');
const { handlePlayFile, handleSendSticker, handleListCommands, handlePostYell } = require('./handlers');
const {
  createYellMap,
  createStickerMap,
  postYell,
  postSticker,
  getAttachmentFromMessage,
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
  if (!message.content.startsWith('!')) return;
  
  const [firstArg, secondArg] = message.content.split(' ');
  const content = message.content;
  
  if (content.startsWith('!yell')) {
    handlePlayFile(message);
  } else if (content.startsWith('!sticker')) {
    handleSendSticker(message);
  } else if (content.startsWith('!stopyell')) {
    if (message.member.voiceChannel) message.member.voiceChannel.leave();
    return;
  } else if (content.startsWith('!listcommands')) {
    handleListCommands(message);
  } else if (content.startsWith('!postyell')) {
    handlePostYell(message, secondArg);
  } else {
    let attachment;
    switch (firstArg) {
      case 'poststicker':
        if (!secondArg) {
          message.reply(
            'you need to provide a sticker name: poststicker [sticker name]'
          );
          return;
        }
        attachment = getAttachmentFromMessage(message);
        if (!attachment) return;
        try {
          await postSticker(secondArg, attachment.url);
          stickerMap = await createStickerMap();
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
