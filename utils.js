const airtableConfig  = require('./config.json');
const base = require('airtable').base(airtableConfig.BASE_ID);

const playFile = async (message, file) => {
  const connection = await message.member.voiceChannel.join();
  const dispatcher = connection.playArbitraryInput(file);
  dispatcher.setVolume(1);
  dispatcher.on('end', () => {
    message.member.voiceChannel.leave();
  });
};

const sendImage = async (message, file) => {
  return await message.channel.send('', {
    file,
  });
};

const createYellMap = async () => {
  const records = await base(airtableConfig.YELL_TABLE_ID).select().all();
  return records.reduce((acc, record) => {
    const command = record.get(airtableConfig.YELL_MESSAGE_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.YELL_FILE_COLUMN_ID)[0].url;
    return { ...acc, [command]: fileUrl };
  }, {});
};

const createStickerMap = async () => {
  const records = await base(airtableConfig.STICKER_TABLE_ID).select().all();
  return records.reduce((acc, record) => {
    const command = record.get(airtableConfig.STICKER_MESSAGE_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.STICKER_IMAGE_COLUMN_ID)
      ? record.get(airtableConfig.STICKER_IMAGE_COLUMN_ID)[0].url
      : null;
    return { ...acc, [command]: fileUrl };
  }, {});
};

const listCommands = async () => {
  const yellRecords = await base(airtableConfig.YELL_TABLE_ID).select().all();
  const stickerRecords = await base(airtableConfig.STICKER_TABLE_ID)
    .select()
    .all();
  const yellCommands = yellRecords.map(record =>
    record.get(airtableConfig.YELL_MESSAGE_COLUMN_ID)
  );
  const stickerCommands = stickerRecords.map(record =>
    record.get(airtableConfig.STICKER_MESSAGE_COLUMN_ID)
  );
  return [yellCommands, stickerCommands];
};

const postYell = async (command, file) => {
  return base(airtableConfig.YELL_TABLE_ID).create([
    {
      fields: {
        [airtableConfig.YELL_MESSAGE_COLUMN_ID]: command,
        [airtableConfig.YELL_FILE_COLUMN_ID]: [
          {
            url: file,
          },
        ],
      },
    },
  ]);
};

const postSticker = async (command, file) => {
  return base(airtableConfig.STICKER_TABLE_ID).create([
    {
      fields: {
        [airtableConfig.STICKER_MESSAGE_COLUMN_ID]: command,
        [airtableConfig.STICKER_IMAGE_COLUMN_ID]: [
          {
            url: file,
          },
        ],
      },
    },
  ]);
};

const getAttachmentFromMessage = async message => {
  const [attachment] = message.attachments.array();
  if (!attachment) {
    throw new Error('you need to add the file as an attachment.');
  }
  if (attachment.filesize > 2000000) {
    throw new Error('that attachment is over the 2MB limit. Please submit a smaller file.');
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
  getAttachmentFromMessage,
};
