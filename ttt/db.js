// mongoose init
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/proj");

// mongoose user model/schema (acts as a collection)
exports.User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, index: true },
    password: String,
    email: String,
  })
);

// mongoose disabled user model
exports.UserDisabled = mongoose.model(
  "UserDisabled",
  new mongoose.Schema({
    username: { type: String, index: true },
    password: String,
    email: String,
    key: String,
  })
);
