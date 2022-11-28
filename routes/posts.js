const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");

// 1.게시글 작성 api
router.post("/", async (req, res) => {
  try {
    const { user, password, title, content } = req.body;
    const date = new Date().toString();

    await Posts.create({
      date,
      user,
      password,
      title,
      content,
    });
    res.json({ message: "게시글을 생성하였습니다." });
  } catch (err) {
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 2.게시글 조회 api (postId, user, title, createdAt)
router.get("/", async (req, res) => {
  const data = await Posts.find();

  let posts = [];
  for (let post of data) {
    const { _id, date, user, title } = post;
    posts.push({ postId: _id, user, title, createdAt: date });
  }

  // date 기준으로 posting정렬
  posts.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  res.json({ data: posts });
});

// 3.게시글 상세 조회 api (postId, user, title, content, createdAt)
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    // _id 값이 일치하는 게시물이 없으면 .findOne()에서 error를 던짐
    const { _id, user, title, content, date } = await Posts.findOne({
      _id: _postId,
    });

    res.json({ data: { postId: _id, user, title, content, createdAt: date } });
  } catch (err) {
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 4.게시글 수정 api (postId, password, title, content)
// ???게시글의 일부만 수정하므로, patch를 사용하는 것이 맞는 것 아닌지??
router.put("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    if (_postId === undefined || password === undefined) {
      // !!에러가 나면, 자동으로 400번으로 들어오는 듯...
      throw new Error("데이터 형식이 올바르지 않습니다.");
    } else {
      try {
        await Posts.updateOne(
          { _id: _postId, password: password },
          { $set: { title, content } }
        );
        res.send({ message: "게시글을 수정하였습니다." });
      } catch (err) {
        res.status(404).send({ message: "게시글 조회에 실패하였습니다." });
      }
    }
  } catch (err) {
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 5.게시글 삭제 api (postId, password)
router.delete("/:_postId", async (req, res) => {
  //???uri에 _postId 값을 전달하지 않으면, 아예 404 에러가 떠버림. req.param에 아무런 값을 전달받지 않았다는 사실을 확인하는 방법??

  const { _postId } = req.params;
  const { password } = req.body;
  console.log(_postId, password);
  if (_postId === undefined || password === undefined) {
    // !!에러가 나면, 자동으로 400번으로 들어오는 듯...
    throw new Error("데이터 형식이 올바르지 않습니다.");
  } else {
    try {
      await Posts.deleteOne({ _id: _postId, password: password });
      res.send({ message: "게시글을 수정하였습니다." });
    } catch (err) {
      res.status(404).send({ message: "게시글 조회에 실패하였습니다." });
    }
  }
});

router.get("/test/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    console.log(_postId, "에러 던지나??");
    const data = await Posts.findOne({ _id: _postId });
    console.log(data);
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
});

module.exports = router;

/**
 * 클라에서 입력하는 URL에 :_postId 값이 아예 없을 경우, 자동으로 404로 응답하며 html이 뜨는데, 원래 그런건지?? => params 값의 유무를 검사하는 것이 무의미?
 *
 */
