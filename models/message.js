const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  Sender: String,
  Recepient: String,
  Subject: String,
  Message: String,
  important: Boolean
});

const messageModel = mongoose.model("message", messageSchema);

module.exports = {
  message: messageModel
};
