const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");

function isBody(req, res) {
  if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  }
  return;
}

// 1.게시글 작성 api
router.post("/", async (req, res) => {
  try {
    await isBody(req, res);
    const { user, password, title, content } = req.body;
    const createdAt = new Date().toISOString();
    await Posts.create({
      createdAt,
      user,
      password,
      title,
      content,
    });
    return res.json({ message: "게시글을 생성하였습니다." });
  } catch (err) {
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 2.게시글 조회 api (postId, user, title, createdAt)
router.get("/", async (req, res) => {
  try {
    const data = await Posts.find();
    let posts = [];
    for (let post of data) {
      const { _id, createdAt, user, title } = post;
      posts.push({ postId: _id, user, title, createdAt });
    }
    posts.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    return res.json({ data: posts });
  } catch (err) {
    console.log(err);
  }
});

// 3.게시글 상세 조회 api (postId, user, title, content, createdAt)
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { _id, user, title, content, createdAt } = await Posts.findOne({
      _id: _postId,
    });
    return res.json({ data: { postId: _id, user, title, content, createdAt } });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 4.게시글 수정 api (postId, password, title, content)
// ???게시글의 일부만 수정하므로, patch를 사용하는 것이 맞는 것 아닌지??
router.put("/:_postId", async (req, res) => {
  try {
    await isBody(req, res);
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    const data = await Posts.findOneAndUpdate(
      { _id: _postId, password },
      { $set: { title, content } }
    );
    if (data === null) throw new Error("입력값에 맞는 데이터가 없음");
    return res.send({ message: "게시글을 수정하였습니다." });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ message: "게시글 조회에 실패하였습니다." });
  }
});

// 5.게시글 삭제 api (postId, password)
router.delete("/:_postId", async (req, res) => {
  try {
    await isBody(req, res);
    const { _postId } = req.params;
    const { password } = req.body;
    const data = await Posts.findOneAndDelete({
      _id: _postId,
      password: password,
    });
    if (data === null) throw new Error("입력값에 맞는 데이터가 없음");
    return res.send({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    console.log(err);
    return res.status(404).send({ message: "게시글 조회에 실패하였습니다." });
  }
});

module.exports = router;
