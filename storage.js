const { Storage } = require('@google-cloud/storage');
const { Datastore } = require('@google-cloud/datastore');
const fetch = require('node-fetch');

const storage = new Storage();
const datastore = new Datastore();
const bucket = storage.bucket('yell-bot');

const uploadFileFromUrl = async (filename, url) => {
  const file = bucket.file(filename);
  const writeStream = file.createWriteStream(); // errors here
  const { body } = await fetch(url);
  body.pipe(writeStream).on('finish', () => {});
};

const saveCommand = async (commandString, url) => {
  const kind = 'Command';
  const taskKey = datastore.key(kind);
  const commandEntity = {
    key: taskKey,
    data: {
      command: commandString,
      url
    }
  };
  await datastore.upsert(commandEntity);
};

const getAllCommands = async () => {
  const query = datastore.createQuery('Command');
  const [commands] = await datastore.runQuery(query);
  return commands.map(command => command.command);
};

module.exports = {
  storage,
  bucket,
  uploadFileFromUrl,
  saveCommand,
  getAllCommands
};
