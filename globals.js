const airtableConfig = require('./config.json');
const base = require('airtable').base(airtableConfig.BASE_ID);

global.isPlaying = false;
global.yellMap = {};
global.stickerMap = {};
global.greetingMap = {};

const updateYellMap = async () => {
  const records = await base(airtableConfig.YELL_TABLE_ID).select().all();
  yellMap = records.reduce((acc, record) => {
    const command = record.get(airtableConfig.YELL_MESSAGE_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.YELL_FILE_COLUMN_ID)[0].url;
    return { ...acc, [command]: fileUrl };
  }, {});
};

const updateStickerMap = async () => {
  const records = await base(airtableConfig.STICKER_TABLE_ID).select().all();
  stickerMap = records.reduce((acc, record) => {
    const command = record.get(airtableConfig.STICKER_MESSAGE_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.STICKER_IMAGE_COLUMN_ID)
      ? record.get(airtableConfig.STICKER_IMAGE_COLUMN_ID)[0].url
      : null;
    return { ...acc, [command]: fileUrl };
  }, {});
};

const updateGreetingMap = async () => {
  const records = await base(airtableConfig.GREETING_TABLE_ID).select().all();
  greetingMap = records.reduce((acc, record) => {
    const userId = record.get(airtableConfig.GREETING_USER_COLUMN_ID);
    const fileUrl = record.get(airtableConfig.GREETING_FILE_COLUMN_ID)[0].url;
    return { ...acc, [userId]: fileUrl };
  }, {});
};

module.exports = {
  updateYellMap,
  updateStickerMap,
  updateGreetingMap,
};
