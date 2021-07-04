const airtable = require('airtable');
const airtableConfig = require('./config.json');

const base = airtable.base(airtableConfig.BASE_ID);

const messageSwitch = (message, switchObj) => {
  const { content } = message;
  const firstWord = content.split(' ')[0].slice(1);
  if (!switchObj[firstWord]) return;
  if (typeof switchObj[firstWord] !== 'function')
    throw new Error('config object requires functions as values');
  return switchObj[firstWord](message);
};

const playFile = async (message, file) => {
  const connection = await message.member.voice.channel.join();
  const dispatcher = connection.play(file);
  isPlaying = true;
  dispatcher.setVolume(1);
  dispatcher.on('finish', () => {
    isPlaying = false;
    message.member.voice.channel.leave();
  });
};

const sendImage = async (message, file) => {
  return message.channel.send('', {
    files: [file],
  });
};

const selectRecords = async tableId => {
  return base(tableId).select().all();
};

const createMapFromRecords = (records, { keyColumnId, fileColumnId }) => {
  return records.reduce((acc, record) => {
    const key = record.get(keyColumnId);
    const file = record.get(fileColumnId)?.[0]?.url;
    return { ...acc, [key]: file };
  }, {});
};

const createMapFactory = ({
  tableId,
  keyColumnId,
  fileColumnId,
}) => async () => {
  const records = await selectRecords(tableId);
  return createMapFromRecords(records, {
    keyColumnId,
    fileColumnId,
  });
};

const createYellMap = createMapFactory({
  tableId: airtableConfig.YELL_TABLE_ID,
  keyColumnId: airtableConfig.YELL_MESSAGE_COLUMN_ID,
  fileColumnId: airtableConfig.YELL_FILE_COLUMN_ID,
});

const createStickerMap = createMapFactory({
  tableId: airtableConfig.STICKER_TABLE_ID,
  keyColumnId: airtableConfig.STICKER_MESSAGE_COLUMN_ID,
  fileColumnId: airtableConfig.STICKER_IMAGE_COLUMN_ID,
});

const listYells = async () => {
  const yellRecords = await selectRecords(airtableConfig.YELL_TABLE_ID);
  const yellCommands = yellRecords.map(record =>
    record.get(airtableConfig.YELL_MESSAGE_COLUMN_ID)
  );
  return yellCommands;
};

const listStickers = async () => {
  const stickerRecords = await selectRecords(airtableConfig.STICKER_TABLE_ID);
  const stickerCommands = stickerRecords.map(record =>
    record.get(airtableConfig.STICKER_MESSAGE_COLUMN_ID)
  );
  return stickerCommands;
};

const createRecord = async ({
  tableId,
  keyColumnId,
  fileColumnId,
  key,
  file,
}) => {
  return base(tableId).create([
    {
      fields: {
        [keyColumnId]: key,
        [fileColumnId]: [
          {
            url: file,
          },
        ],
      },
    },
  ]);
};

const postYell = async (command, file) => {
  return createRecord({
    tableId: airtableConfig.YELL_TABLE_ID,
    keyColumnId: airtableConfig.YELL_MESSAGE_COLUMN_ID,
    fileColumnId: airtableConfig.YELL_FILE_COLUMN_ID,
    key: command,
    file,
  });
};

const postSticker = async (command, file) => {
  return createRecord({
    tableId: airtableConfig.STICKER_TABLE_ID,
    keyColumnId: airtableConfig.STICKER_MESSAGE_COLUMN_ID,
    fileColumnId: airtableConfig.STICKER_IMAGE_COLUMN_ID,
    key: command,
    file,
  });
};

const getAttachmentFromMessage = message => {
  const [attachment] = message.attachments.array();
  if (!attachment) {
    throw new Error('you need to add the file as an attachment.');
  }
  if (attachment.filesize > 2000000) {
    throw new Error(
      'that attachment is over the 2MB limit. Please submit a smaller file.'
    );
  }
  return attachment;
};

const postGreeting = async (userId, file) => {
  return createRecord({
    tableId: airtableConfig.GREETING_TABLE_ID,
    keyColumnId: airtableConfig.GREETING_USER_COLUMN_ID,
    fileColumnId: airtableConfig.GREETING_FILE_COLUMN_ID,
    key: userId,
    file,
  });
};

module.exports = {
  messageSwitch,
  playFile,
  sendImage,
  createYellMap,
  createStickerMap,
  listYells,
  listStickers,
  postYell,
  postSticker,
  getAttachmentFromMessage,
  postGreeting,
};
