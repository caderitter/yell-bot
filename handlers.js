const {
  playFile,
  sendImage,
  listYells,
  listStickers,
  postYell,
  postSticker,
  getAttachmentFromMessage,
} = require('./utils');
const { updateYellMap, updateStickerMap } = require('./globals');

const handlePlayFile = async message => {
  if (isPlaying) return;
  const [, secondArg] = message.content.split(' ');
  const file = yellMap[secondArg];
  if (!file) return;
  try {
    if (message.member.voice.channel) {
      await playFile(message, file);
    } else {
      message.reply('get in a voice channel ya dummy');
    }
  } catch (e) {
    message.reply('yell failed to play: ' + e);
  }
};

const handleSendSticker = async message => {
  const [, secondArg] = message.content.split(' ');
  const file = stickerMap[secondArg];
  if (!file) return;
  try {
    await sendImage(message, file);
    await message.delete();
  } catch (e) {
    message.reply('sticker failed to send: ' + e);
  }
};

const handleStopYell = message => {
  isPlaying = false;
  message.member.voice.channel && message.member.voice.channel.leave();
};

const createCommandEmbed = (title, commands) => {
  return {
    embed: {
      title,
      description: commands.reduce((acc, cur) => acc + `- ${cur} \n`, ''),
    },
  };
};

const handleHelp = async message => {
  const [, secondArg] = message.content.split(' ');
  if (secondArg === 'yell') {
    const yellCommands = await listYells();
    message.channel.send(createCommandEmbed('Available yells', yellCommands));
  } else if (secondArg === 'sticker') {
    const stickerCommands = await listStickers();
    message.channel.send(
      createCommandEmbed('Available stickers', stickerCommands)
    );
  } else if (!secondArg) {
    message.channel.send({
      embed: {
        title: "Frank's commands",
        description:
          '**Yell**\n\n`!yell <yellname>` - Frank joins your voice channel and yells\n\n`!stopyell` - forces Frank to stop yelling\n\n`!postyell <yellname>` - posts a new yell *(requires that the audio file is attached to the message)*\n\n\n**Sticker**\n\n`!sticker <stickername>` - Frank posts the sticker to the text channel\n\n`!poststicker <stickername>`-  posts a new sticker *(requires that the sticker image is attached to the message)*\n\n\n**Help**\n\n`!help` - displays this page\n\n`!help yell` - displays a list of possible yells\n\n`!help sticker` - displays a list of possible stickers\n\n\n\n\n',
      },
    });
  }
};

const handlePostYell = async message => {
  const [, secondArg] = message.content.split(' ');

  if (!secondArg) {
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
    await postYell(secondArg, attachment.url);
    await updateYellMap();
    message.reply(`yell ${secondArg} created.`);
  } catch (e) {
    message.reply('there was an error: ' + e);
  }
};

const handlePostSticker = async message => {
  const [, secondArg] = message.content.split(' ');

  if (!secondArg) {
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
    await postSticker(secondArg, attachment.url);
    await updateStickerMap();
    message.reply(`sticker ${secondArg} created.`);
  } catch (e) {
    message.reply('there was an error: ' + e);
  }
};

module.exports = {
  handlePlayFile,
  handleSendSticker,
  handleStopYell,
  handleHelp,
  handlePostYell,
  handlePostSticker,
};
