const express = require("express");
const router = express.Router();
const Goods = require("../schemas/goods");

router.post("/", async (req, res) => {
  // console.log(req.body); //error를 만날 때 각 단계별로 찍어보기
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }
  // console.log(goods);

  const createdGoods = await Goods.create({
    goodsId,
    name,
    thumbnailUrl,
    category,
    price,
  });

  console.log(Goods.findOne({ goodsId: 2 }));

  res.json({ goods: createdGoods });
});

module.exports = router;
