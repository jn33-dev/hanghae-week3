const express = require("express");
const app = express();
const port = 3000;
const connect = require("./schemas");
connect();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("기본 URI에 POST Method가 정상적으로 실행되었습니다");
});

const goodsRouter = require("./routes/goods.js");
app.use("/api/goods", [goodsRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
