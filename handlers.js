const {
  playFile,
  sendImage,
  createYellMap,
  createStickerMap,
  listCommands,
  postYell,
  postSticker,
  getAttachmentFromMessage,
} = require('./utils');

const handlePlayFile = async message => {
  yellMap = await createYellMap();
  if (!yellMap[message.content]) return;
  const file = yellMap[message.content];
  try {
    if (message.member.voiceChannel) {
      await playFile(message, file);
    } else {
      message.reply('get in a voice channel ya dummy');
    }
  } catch (e) {
    message.reply('yell failed to play: ' + e);
  }
};

const handleSendSticker = async message => {
  const stickerMap = createStickerMap();
  const file = stickerMap[secondArg];
  if (!file) return;
  try {
    await sendImage(message, file);
  } catch (e) {
    message.reply('sticker failed to send: ' + e);
  }
};

const handleListCommands = async message => {
  try {
    const [yellCommands, stickerCommands] = await listCommands();
    message.channel.send([
      '',
      'Yells:',
      ...yellCommands,
      '',
      'Stickers:',
      ...stickerCommands.map(c => `sticker ${c}`),
      '',
      'Utils:',
      '!postyell [name] -- this requires an attachment',
      '!poststicker [name] -- this requires an attachment',
      '!stopyell',
    ]);
  } catch (e) {
    message.reply('there was an error while fetching commands: ' + e);
  }
};

const handlePostYell = async (message, yellName) => {
  if (!yellName) {
    message.reply('you need to provide a yell name: !postyell [yell name]');
    return;
  }

  let attachment;
  try {
    attachment = getAttachmentFromMessage(message);
  } catch (e) {
    message.reply(e.message);
    return;
  }

  try {
    await postYell(yellName, attachment.url);
    message.reply(`yell ${yellName} created.`);
  } catch (e) {
    message.reply('there was an error: ' + e);
  }
};

const handlePostSticker = async (message, stickerName) => {
  if (!stickerName) {
    message.reply(
      'you need to provide a sticker name: !poststicker [sticker name]'
    );
    return;
  }

  let attachment;
  try {
    attachment = getAttachmentFromMessage(message);
  } catch (e) {
    message.reply(e.message);
    return;
  }
  
  try {
    await postSticker(stickerName, attachment.url);
    message.reply(`sticker ${stickerName} created.`);
  } catch (e) {
    message.reply('there was an error: ' + e);
  }
};

const handleBind = (message, handleChannelUpdate) => {
  const channel = message.channel;
  message.channel.send('frank is now soul bound to this channel');
  handleChannelUpdate(channel);
};

module.exports = {
  handlePlayFile,
  handleSendSticker,
  handleListCommands,
  handlePostYell,
  handlePostSticker,
  handleBind,
};
