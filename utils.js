const playFile = async (message, file) => {
  if (message.member.voiceChannel) {
    const connection = await message.member.voiceChannel.join();
    const dispatcher = connection.playArbitraryInput(file);
    dispatcher.setVolume(1);
    dispatcher.on('end', () => {
      message.member.voiceChannel.leave();
    });
  } else {
    message.reply('get in a voice channel ya dummy');
  }
};

module.exports = {
  playFile
};
