const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment");
const Posts = require("../schemas/post");

/**
 * 추가 작업 할 것
 * req.params와 req.body 검증하는 함수 하나 짜고, 공통으로 사용
 */

function isParams()

// 1.댓글 작성 api (postId, user, password, content, createdAt)
router.post("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;

  if (!content || !content.length)
    return res.status(400).send({ message: "댓글 내용을 입력해주세요." });
  try {
    await Posts.findOne({ id: _postId });
    const createdAt = new Date().toString();
    await Comments.create({
      postId: _postId,
      createdAt,
      user,
      password,
      content,
    });
    res.json({ message: "댓글을  생성하였습니다." });
  } catch (err) {
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 2. 댓글 목록 조회
router.get("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const data = await Comments.find({ postId: _postId });
  if (!data.length) {
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  } else {
    comments = [];
    for (let c of data) {
      console.log("c:", c);
      const { _id, user, content, createdAt } = c;
      comments.push({ commentId: _id, user, content, createdAt });
    }
    comments.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
    return res.json({ data: comments });
  }
});

// 3. 댓글 수정 api (commentId, password, content)
router.put("/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password, content } = req.body;

  if (!content || !content.length)
    return res.status(400).send({ message: "댓글 내용을 입력해주세요." });

  if (!password.length) {
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  } else {
    try {
      const data = await Comments.updateOne(
        { _id: _commentId, password: password },
        { $set: { content: content } }
      );
      // console.log(data);
      return res.send({ message: "댓글을 성공적으로 수정하였습니다!" });
    } catch (err) {
      return res.status(404).send({ message: "댓글 조회에 실패하였습니다." });
    }
  }
});

// 4. 댓글 삭제 api (commentId, password)
router.delete("/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;

  if (!password || !password.length) {
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  }

  try {
    await Comments.deleteOne({ _id: _commentId, password: password });
    return res.send({ message: "댓글을 성공적으로 삭제하였습니다!" });
  } catch (err) {
    return res.status(404).send({ message: "댓글 조회에 실패하였습니다." });
  }
});

module.exports = router;
