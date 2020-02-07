const { Storage } = require("@google-cloud/storage");
const request = require("request");

const storage = new Storage();
const bucket = storage.bucket("yell-bot");

const uploadFileFromUrl = async (filename, url) => {
  const file = await bucket.file(filename, {
    gzip: true,
    metadata: {
      cacheControl: "public, max-age=31536000",
    },
  });
  const writeStream = file.createWriteStream();
  await request(url).pipe(writeStream);
};

module.exports = {
  storage,
  bucket,
  uploadFileFromUrl,
};
