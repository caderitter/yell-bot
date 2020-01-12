module.exports.joinChannelAndPlayFile = function (message, file) {  
  if (message.member.voiceChannel) {
    message.member.voiceChannel.join()
      .then(connection => { // Connection is an instance of VoiceConnection
        const dispatcher = connection.playFile(file)
        dispatcher.setVolume(1);
        dispatcher.on('end', () => {
          message.member.voiceChannel.leave();
        });
      });
  } else {
    message.reply('get in a voice channel ya dummy');
  }
  isReady = true;
}
