const base = require('airtable').base('appcLczgHk2kiv2Pc');

const playFile = function (message, file) {  
  if (message.member.voiceChannel) {
    message.member.voiceChannel.join()
      .then(connection => {
        const dispatcher = connection.playArbitraryInput(file)
        dispatcher.setVolume(1);
        dispatcher.on('end', () => {
          message.member.voiceChannel.leave();
        });
      });
  } else {
    message.reply('get in a voice channel ya dummy');
  }
}

const updateCommands = async () => {
  let map;
  const records = await base('yell-bot').select().all();
  records.forEach(record => {
    const command = record.get('Command');
    const fileUrl = record.get('Audio file to play')[0].url;
    map = { [command]: fileUrl, ...map };
  });
  return map;
};

const handleMessage = switchObj => message => {
  if (switchObj[message.content]) return switchObj[message.content](message);
}

module.exports = {
  playFile,
  updateCommands,
  handleMessage
};
