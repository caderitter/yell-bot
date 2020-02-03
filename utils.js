const { airtableConfig } = require('./config');
const base = require('airtable').base(airtableConfig.BASE_ID);

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

const createCommandMap = async () => {
  const records = await base(airtableConfig.TABLE_ID)
    .select()
    .all();
  return records.reduce((acc, record) => {
    const command = record.get(airtableConfig.MESSAGE_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.FILE_COLUMN_ID)[0].url;
    return { ...acc, [command]: fileUrl };
  }, {});
};

const listCommands = async () => {
  const records = await base(airtableConfig.TABLE_ID)
    .select()
    .all();
  return records.map(record => record.get(airtableConfig.MESSAGE_COLUMN_ID));
};

module.exports = {
  playFile,
  createCommandMap,
  listCommands
};
