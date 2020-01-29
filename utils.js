const base = require('airtable').base('appcLczgHk2kiv2Pc');

const playFile = (message, file) => {  
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

const createCommandMap = async () => {
  const records = await base('yell-bot').select().all();
  const map = records.reduce((acc, record) => {
    const command = record.get('Command');
    const fileUrl = record.get('Audio file to play')[0].url;
    return { ...acc, [command]: fileUrl };
  }, {});
  return map;
};

const listCommands = async () => {
  const records = await base('yell-bot').select().all();
  return records.reduce((acc, record) => [...acc, record.get('Command')], []);
}

module.exports = {
  playFile,
  createCommandMap,
  listCommands
};
