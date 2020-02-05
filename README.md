### Yell bot

Stupid bot made for our discord server. Uses Airtable as its data store.

## Quickstart

This assumes you have an Airtable base created with a table with two columns, one for the text command, and one for the audio file. You also should create a form to allow users to post commands and audio files.

1. Put your keys in a .env file in the same directory:

```.env
DISCORD_API_KEY=discord key
AIRTABLE_API_KEY=airtable key
```

2. Add your airtable constants to `config.js`.

```js
const airtableConfig = {
  BASE_ID: 'base id from your api docs',
  TABLE_ID: 'actual id of the table in the base',
  MESSAGE_COLUMN_ID: 'the message column id',
  FILE_COLUMN_ID: 'the file column id',
  FORM_URL: 'the url to your airtable form'
};
```

3. Install deps and start:

```sh
npm i
npm start
```

4. Available commands are:

    `listcommands` - lists commands

    `updatecommands` - updates commands from airtable. run after you add a command through the form to fetch new commands

    `postcommand` - replies with a link to your airtable form

    and of course your added commands.
 
