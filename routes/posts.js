const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post");

/**
 * 검증 함수 적용 예정
 * 검증 함수를 router 안에 적용하면, Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client가 뜸
 * 즉, res 값이 이미 전달 됐는데(검증 함수 내의 res), 또 다른 res가 전달됨(본문 안 catch문의 res)
 */
function isBody(req, res) {
  console.log("isBody() 검증 시작");
  if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
    console.log("!bodyArr.length");
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  } else return true;
}

// 1.게시글 작성 api
router.post("/", async (req, res) => {
  try {
    const { user, password, title, content } = req.body;
    const createdAt = new Date().toString();
    await Posts.create({
      createdAt,
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
    const { _id, createdAt, user, title } = post;
    posts.push({ postId: _id, user, title, createdAt });
  }

  posts.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  res.json({ data: posts });
});

// 3.게시글 상세 조회 api (postId, user, title, content, createdAt)
router.get("/:_postId", async (req, res) => {
  try {
    const { _postId } = req.params;
    const { _id, user, title, content, createdAt } = await Posts.findOne({
      _id: _postId,
    });

    res.json({ data: { postId: _id, user, title, content, createdAt } });
  } catch (err) {
    res.status(400).send({ message: "데이터 형식이 올바르지 않습니다." });
  }
});

// 4.게시글 수정 api (postId, password, title, content)
// ???게시글의 일부만 수정하므로, patch를 사용하는 것이 맞는 것 아닌지??
router.put("/:_postId", async (req, res) => {
  if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
    console.log("!bodyArr.length");
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  } else {
    try {
      const { _postId } = req.params;
      const { password, title, content } = req.body;
      await Posts.updateOne(
        { _id: _postId, password: password },
        { $set: { title, content } }
      );
      res.send({ message: "게시글을 수정하였습니다." });
    } catch (err) {
      res.status(404).send({ message: "게시글 조회에 실패하였습니다." });
    }
  }
});

// 5.게시글 삭제 api (postId, password)
router.delete("/:_postId", async (req, res) => {
  if (!Object.values(req.body).length || Object.values(req.body).includes("")) {
    console.log("!bodyArr.length");
    return res
      .status(400)
      .send({ message: "데이터 형식이 올바르지 않습니다." });
  } else {
    try {
      const { _postId } = req.params;
      const { password } = req.body;
      await Posts.deleteOne({ _id: _postId, password: password });
      res.send({ message: "게시글을 삭제하였습니다." });
    } catch (err) {
      res.status(404).send({ message: "게시글 조회에 실패하였습니다." });
    }
  }
});

module.exports = router;

/**
 * 클라에서 입력하는 URL에 :_postId 값이 아예 없을 경우, 자동으로 404로 응답하며 html이 뜨는데, 원래 그런건지?? => params 값의 유무를 검사하는 것이 무의미?
 *
 */
