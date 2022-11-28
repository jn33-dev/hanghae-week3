const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model("Posts", postsSchema);
