const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment");
const Posts = require("../schemas/post");

/**
 * 검증함수 적용 예정
 * Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client 에러 해결 후, 검증함수를 미들웨어로 만들어서, posts와 comments에 한방에 적용
 */

function isBody(body) {
  if (!Object.values(body).length || Object.values(body).includes("")) {
    throw new SyntaxError("req.body: 데이터 형식이 올바르지 않습니다.");
  }
  return;
}

// 1.댓글 작성 api (postId, user, password, content, createdAt)
router.post("/:_postId", async (req, res) => {
  const { _postId } = req.params;
  const { user, password, content } = req.body;
  if (!content || !content.length)
    return res.status(400).send({ message: "댓글 내용을 입력해주세요." });
  await isBody(req.body);
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
  try {
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
  } catch (err) {}
});

// 3. 댓글 수정 api (commentId, password, content)
router.put("/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password, content } = req.body;

  if (!content || !content.length)
    return res.status(400).send({ message: "댓글 내용을 입력해주세요." });
  await isBody(req.body);
  try {
    const data = await Comments.updateOne(
      { _id: _commentId, password: password },
      { $set: { content: content } }
    );
    console.log(data);
    if (!data.matchedCount) throw new Error("댓글 조회에 실패하였습니다.");
    return res.send({ message: "댓글을 성공적으로 수정하였습니다!" });
  } catch (err) {
    console.log(err.name, err.massage);
    return res.status(404).send({ message: "댓글 조회에 실패하였습니다." });
  }
});

// 4. 댓글 삭제 api (commentId, password)
router.delete("/:_commentId", async (req, res) => {
  const { _commentId } = req.params;
  const { password } = req.body;
  await isBody(req.body);
  try {
    const data = await Comments.findOneAndDelete({
      _id: _commentId,
      password: password,
    });
    console.log(data);
    if (data === null)
      throw new Error("return null : 댓글 조회에 실패하였습니다.");
    return res.send({ message: "댓글을 성공적으로 삭제하였습니다!" });
  } catch (err) {
    console.log(err.name, err.massage);
    return res.status(404).send({ message: "댓글 조회에 실패하였습니다." });
  }
});

module.exports = router;
