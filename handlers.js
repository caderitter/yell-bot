const { uploadFileFromUrl, saveCommand, getAllCommands } = require('./storage');
const { playFile } = require('./utils');
const fetch = require('node-fetch');

const handlePost = async message => {
  const [attachment] = message.attachments.array();
  if (!attachment) {
    message.reply('you need to add the file as an attachment.');
    return;
  }
  if (attachment.filesize > 2000000) {
    message.reply(
      'that attachment is over the 2MB limit. Please submit a smaller file.'
    );
    return;
  }
  const [, secondArg] = message.content.split(' ');
  if (!secondArg) {
    message.reply('you need to supply a command: --post [command]');
    return;
  }

  const filename = attachment.filename;
  const fileUrl = attachment.url;

  try {
    await uploadFileFromUrl(filename, fileUrl);
    const url = `https://storage.googleapis.com/yell-bot-bucket/${filename}`;
    saveCommand(secondArg, url);
    message.reply(`command ${secondArg} created with file ${url}`);
  } catch (e) {
    message.reply('there was an error: ' + e);
  }
};

const handleMessage = async message => {
  if (!message.guild) return;

  const [firstArg] = message.content.split(' ');
  if (firstArg.slice(0, 2) !== '--') return;

  const firstArgTrimmed = firstArg.slice(2);
  const commands = await getAllCommands();
  if (commands[firstArgTrimmed]) {
    playFile(message, commands[firstArgTrimmed]);
  }
  switch (firstArgTrimmed) {
    case 'list':
      try {
        message.reply([...commands, , '--list', '--post', '--stop']);
      } catch (e) {
        message.reply('there was an error while fetching commands: ' + e);
      }
      return;
    case 'post':
      handlePost(message);
    case 'stop':
      if (message.member.voiceChannel) message.member.voiceChannel.leave();
      return;
    case 'help':
      message.reply(`
USAGE:
      --[command]   play an uploaded command
      --list        list all commands
      --post        post a command (attach the audio file to the message)
      --stop        forces the bot to leave a channel
      `);
    default:
      return;
  }
};

module.exports = {
  handlePost,
  handleMessage
};
