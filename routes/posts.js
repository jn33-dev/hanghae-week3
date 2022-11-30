const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");
const Comments = require("../schemas/comment");

class BodyError {
  constructor() {
    this.name = "BodyError";
    this.message = "데이터 형식이 올바르지 않습니다.";
    this.status = 400;
  }
}

class IdentifyError {
  constructor() {
    this.name = "IdentifyError";
    this.message = "게시글 조회에 실패했습니다.";
    this.status = 404;
  }
}

function isBody(req, res) {
  if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
    throw new BodyError();
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
    console.log(err);
    return res.status(err.status).send({ message: err.message });
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
    return res.status(err.status).send({ message: err.message });
  }
});

// 3.게시글 상세 조회 api (postId, user, title, content, createdAt)
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const data = await Posts.findOne({
      _id: _postId,
    });
    if (data === null) throw new IdentifyError();
    const { _id, user, title, content, createdAt } = data;

    // 해당 게시글 댓글 조회
    const comment = await Comments.find({ postId: _postId });
    comments = [];
    if (comment.length) {
      for (let c of comment) {
        const { _id, user, content, createdAt } = c;
        comments.push({ commentId: _id, user, content, createdAt });
      }
      comments.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    } else {
      comments.push("유효한 댓글 데이터가 없습니다.");
    }

    // 게시글 상세조회 + 댓글 목록을 res로 쏴주기
    return res.json({
      data: { postId: _id, user, title, content, createdAt },
      comments,
    });
  } catch (err) {
    console.log(err);
    if (!err.status) {
      return res.status(400).send({ message: err.message });
    } else return res.status(err.status).send({ message: err.message });
  }
});

// 4.게시글 수정 api (postId, password, title, content)
router.put("/:_postId", async (req, res) => {
  try {
    await isBody(req, res);
    const { _postId } = req.params;
    const { password, title, content } = req.body;
    const data = await Posts.findOneAndUpdate(
      { _id: _postId, password },
      { $set: { title, content } }
    );
    if (data === null) throw new IdentifyError();
    return res.send({ message: "게시글을 수정하였습니다." });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send({ message: err.message });
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
    if (data === null) throw new IdentifyError();
    return res.send({ message: "게시글을 삭제하였습니다." });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send({ message: err.message });
  }
});

module.exports = router;
