const express = require("express");
const app = express();
const port = 3000;
const connect = require("./schemas");
connect();

app.use(express.json());

const indexRouter = require("./routes/index");
app.use("/", indexRouter);

const postsRouter = require("./routes/posts");
app.use("/posts", postsRouter);

const commentsRouter = require("./routes/comments");
app.use("/comments", commentsRouter);

app.listen(port, () => {
  console.log(port, "포트로 서버가 잘 열렸습니다!");
});
