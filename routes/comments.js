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

function isBody(req, res) {
  if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
    throw new BodyError();
  }
  return;
}

// 1.댓글 작성 api (postId, user, password, content, createdAt)
router.post("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { user, password, content } = req.body;
    if (!content || !content.length)
      return res.status(400).send({ message: "댓글 내용을 입력해주세요." });
    await isBody(req, res);
    const post = await Posts.findOne({ _id: _postId });
    if (post === null) {
      return res
        .status(404)
        .send({ message: "유효한 게시글을 찾을 수 없습니다." });
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
    if (err === BodyError) {
      return res.status(err.status).send({ message: err.message });
    } else
      return res
        .status(400)
        .send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 2. 댓글 목록 조회
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    //??_postId로 Post data에서 포스트가 있는지 먼저 검증을 하는게 좋을지??
    const post = await Posts.findOne({ _id: _postId });
    if (post === null) {
      return res
        .status(404)
        .send({ message: "유효한 게시글을 찾을 수 없습니다." });
    }
    const data = await Comments.find({ postId: _postId });
    // postId에 해당하는 post가 있으므로, 해당 post에 comments가 없는 경우, 빈 배열 return
    if (!data.length) {
      return res
        .status(404)
        .send({ message: "입력하신 postId로 유효한 댓글을 찾을 수 없습니다." });
    }

    comments = [];
    for (let c of data) {
      const { _id, user, content, createdAt } = c;
      comments.push({ commentId: _id, user, content, createdAt });
    }
    comments.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    return res.json({ data: comments });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 3. 댓글 수정 api (commentId, password, content)
router.put("/:_commentId", async (req, res) => {
  try {
    const { _commentId } = req.params;
    const { password, content } = req.body;
    if (!content || !content.length)
      return res.status(400).send({ message: "댓글 내용을 입력해주세요." });
    await isBody(req, res);

    const data = await Comments.findOneAndUpdate(
      { _id: _commentId, password },
      { $set: { content } }
    );
    if (data === null) throw new Error("입력값에 맞는 데이터가 없음");
    return res.send({ message: "댓글을 성공적으로 수정하였습니다!" });
  } catch (err) {
    console.log(err);
    if (err === BodyError) {
      return res.status(err.status).send({ message: err.message });
    } else
      return res.status(404).send({ message: "댓글 조회에 실패하였습니다." });
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
    if (data === null) throw new Error("입력값에 맞는 데이터가 없음");
    return res.send({ message: "댓글을 성공적으로 삭제하였습니다!" });
  } catch (err) {
    console.log(err);
    if (err === BodyError) {
      return res.status(err.status).send({ message: err.message });
    } else
      return res.status(404).send({ message: "댓글 조회에 실패하였습니다." });
  }
});

module.exports = router;
