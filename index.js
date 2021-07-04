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
  handlePostGreeting,
} = require('./handlers');
const {
  updateYellMap,
  updateStickerMap,
  updateGreetingMap,
} = require('./globals');

(function () {
  const client = new Discord.Client();

  client.on('ready', async () => {
    try {
      await updateYellMap();
      await updateStickerMap();
      await updateGreetingMap();
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
      postgreeting: m => handlePostGreeting(m),
    });
  });

  client.on('voiceStateUpdate', async (oldState, newState) => {
    if (isPlaying) return;

    if (!newState?.channelID) return;
    if (oldState.channelID === newState.channelID) return;

    const channel = newState.channel;
    const userId = newState.id;
    const file = greetingMap[userId];
    if (!file) return;
    const connection = await channel.join();
    const dispatcher = connection.play(file);
    isPlaying = true;
    dispatcher.setVolume(0.6);
    dispatcher.on('finish', () => {
      channel.leave();
      isPlaying = false;
    });
  });

  client.login(process.env.DISCORD_API_KEY);
})();
