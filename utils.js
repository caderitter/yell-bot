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

const sendImage = async (message, file) => {
  return await message.channel.send('', {
    file
  });
};

const createYellMap = async () => {
  const records = await base(airtableConfig.TABLE_ID)
    .select()
    .all();
  return records.reduce((acc, record) => {
    const command = record.get(airtableConfig.MESSAGE_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.FILE_COLUMN_ID)[0].url;
    return { ...acc, [command]: fileUrl };
  }, {});
};

const createStickerMap = async () => {
  const records = await base(airtableConfig.STICKER_TABLE_ID)
    .select()
    .all();
  return records.reduce((acc, record) => {
    const command = record.get(airtableConfig.STICKER_MESSAGE_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.STICKER_IMAGE_COLUMN_ID)
      ? record.get(airtableConfig.STICKER_IMAGE_COLUMN_ID)[0].url
      : null;
    return { ...acc, [command]: fileUrl };
  }, {});
};

const listCommands = async () => {
  const yellRecords = await base(airtableConfig.TABLE_ID)
    .select()
    .all();
  const stickerRecords = await base(airtableConfig.STICKER_TABLE_ID)
    .select()
    .all();
  const yellCommands = yellRecords.map(record =>
    record.get(airtableConfig.MESSAGE_COLUMN_ID)
  );
  const stickerCommands = stickerRecords.map(record =>
    record.get(airtableConfig.STICKER_MESSAGE_COLUMN_ID)
  );
  return [yellCommands, stickerCommands];
};

const postYell = async (command, file) => {
  return base(airtableConfig.TABLE_ID).create([
    {
      fields: {
        [airtableConfig.MESSAGE_COLUMN_ID]: command,
        [airtableConfig.FILE_COLUMN_ID]: [
          {
            url: file
          }
        ]
      }
    }
  ]);
};

const postSticker = async (command, file) => {
  return base(airtableConfig.STICKER_TABLE_ID).create([
    {
      fields: {
        [airtableConfig.STICKER_MESSAGE_COLUMN_ID]: command,
        [airtableConfig.STICKER_IMAGE_COLUMN_ID]: [
          {
            url: file
          }
        ]
      }
    }
  ]);
};

const getAttachmentFromMessage = message => {
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
  return attachment;
};

module.exports = {
  playFile,
  sendImage,
  createYellMap,
  createStickerMap,
  listCommands,
  postYell,
  postSticker,
  getAttachmentFromMessage
};
