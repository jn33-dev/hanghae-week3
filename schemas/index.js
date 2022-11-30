require("dotenv").config();
const mongodb_uri = process.env.MONGODB;

const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(mongodb_uri, { useNewUrlParser: true })
    .catch((err) => console.log("몽고디비 연결 에러", err));
};

module.exports = connect;
