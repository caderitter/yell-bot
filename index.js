require('dotenv').config();
const Discord = require('discord.js');
const { messageSwitch } = require('./utils');
const {
  handlePlayFile,
  handleSendSticker,
  handleStopYell,
  handleHelp,
  handlePostYell,
  handlePostSticker,
} = require('./handlers');
const { updateYellMap, updateStickerMap } = require('./globals');

(function () {
  const client = new Discord.Client();

  client.on('ready', async () => {
    try {
      await updateYellMap();
      await updateStickerMap();
      console.log('i am ready');
    } catch (e) {
      console.error('there was an error creating maps: ' + e);
    }
  });

  client.on('message', async message => {
    if (!message.guild) return;
    if (!message.content.startsWith('!')) return;

    messageSwitch(message, {
      yell: m => handlePlayFile(m),
      sticker: m => handleSendSticker(m),
      stopyell: m => handleStopYell(m),
      help: m => handleHelp(m),
      postyell: m => handlePostYell(m),
      poststicker: m => handlePostSticker(m),
    });
  });

  client.login(process.env.DISCORD_API_KEY);
})();
