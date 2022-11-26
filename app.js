const express = require("express");
const app = express();
const port = 3000;
const goodsRouter = require("./routes/goods.js");
const usersRouter = require("./routes/users.js");

//전역 미들웨어에 body parser를 적용
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/api", [goodsRouter, usersRouter]);

app.post("/", (req, res) => {
  console.log(req.body); // { key1234: '안녕하세요. key1234입니다.' }
  res.send("기본 URI에 POST Method가 정상적으로 실행되었습니다");
});

app.get("/", (req, res) => {
  console.log(req.query); // { queryKey: 'valuevalue' }

  // res.status, res.json 사용
  res.status(400).json({
    keyKey: "value 입니다.",
    "이름입니다.": "이름일까요?",
  });
});

app.get("/:id", (req, res) => {
  console.log(req.params); //{ id: 'helloworld123' } (key-value 쌍으로 들어오는데, uri 뒤에 key 값을 id로 선언해 주었기 때문)
  res.send(":id URI에 정상적으로 반환되었습니다.");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
