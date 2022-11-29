const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect("mongodb://127.0.0.1/w3-personal", { useNewUrlParser: true })
    .catch((err) => console.log("몽고디비 연결 에러", err));
};

module.exports = connect;
