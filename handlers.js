const { uploadFileFromUrl } = require("./storage");

const handlePost = async message => {
  if (message.attachments.length !== 1) {
    message.reply(
      "Invalid amount of attachments. Please attach only one file to the message."
    );
    return;
  }
  if (message.attachments[0].filesize > 2_000_000) {
    message.reply(
      "That attachment is over the 2MB limit. Please submit a smaller file."
    );
    return;
  }

  const filename = message.attachments[0].filename;
  const fileUrl = message.attachments[0].url;

  try {
    await uploadFileFromUrl(filename, fileUrl);
    message.reply("file uploaded!");
  } catch (e) {
    message.reply("there was an error: " + e);
  }
};

module.exports = {
  handlePost,
};
