const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://localhost:27017/spa_db")
    .catch((err) => console.log("몽고디비 연결 에러", err));
};

module.exports = connect;
