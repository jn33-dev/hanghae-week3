const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment");
const Posts = require("../schemas/post");

class BodyError {
  constructor() {
    this.name = "BodyError";
    this.message = "데이터 형식이 올바르지 않습니다.";
    this.status = 400;
  }
}

class ContentError {
  constructor() {
    this.name = "ContentError";
    this.message = "댓글 내용을 입력해주세요";
    this.status = 400;
  }
}

class CommentError {
  constructor() {
    this.name = "CommentError";
    this.message = "댓글 조회에 실패했습니다.";
    this.status = 404;
  }
}

class IdentifierError {
  constructor() {
    this.name = "IdentifierError";
    this.message = "게시글 조회에 실패했습니다.";
    this.status = 404;
  }
}

function isBody(req, res) {
  if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
    throw BodyError();
  }
  return;
}

// 1.댓글 작성 api (postId, user, password, content, createdAt)
router.post("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { user, password, content } = req.body;
    if (!content || !content.length) throw new ContentError();
    await isBody(req, res);
    const post = await Posts.findOne({ _id: _postId });
    if (post === null) {
      throw IdentifierError();
    }
    const createdAt = new Date().toISOString();
    await Comments.create({
      postId: _postId,
      createdAt,
      user,
      password,
      content,
    });
    return res.json({ message: "댓글을  생성하였습니다." });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send({ message: err.message });
  }
});

// 2. 댓글 목록 조회
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const post = await Posts.findOne({ _id: _postId });
    if (post === null) throw IdentifierError();
    const data = await Comments.find({ postId: _postId });
    if (!data.length) throw CommentError();

    comments = [];
    for (let c of data) {
      const { _id, user, content, createdAt } = c;
      comments.push({ commentId: _id, user, content, createdAt });
    }
    comments.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    return res.json({ data: comments });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send({ message: err.message });
  }
});

// 3. 댓글 수정 api (commentId, password, content)
router.put("/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const { password, content } = req.body;
    if (!content || !content.length) throw ContentError;
    await isBody(req, res);

    const data = await Comments.findOneAndUpdate(
      { _id: _commentId, password },
      { $set: { content } }
    );
    if (data === null) throw CommentError;
    return res.send({ message: "댓글을 성공적으로 수정하였습니다!" });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send({ message: err.message });
  }
});

// 4. 댓글 삭제 api (commentId, password)
router.delete("/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const { password } = req.body;
    await isBody(req, res);

    const data = await Comments.findOneAndDelete({
      _id: _commentId,
      password: password,
    });
    if (data === null) throw CommentError;
    return res.send({ message: "댓글을 성공적으로 삭제하였습니다!" });
  } catch (err) {
    console.log(err);
    return res.status(err.status).send({ message: err.message });
  }
});

module.exports = router;
