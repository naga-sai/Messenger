const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  phone: String,
  gender: String
});

const userModel = mongoose.model("user", userSchema);

module.exports = {
  user: userModel
};
