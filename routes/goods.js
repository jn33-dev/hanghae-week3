const express = require("express");
const router = express.Router();
const Goods = require("../schemas/goods");
const Cart = require("../schemas/cart");

// [POST]상품 db에 상품 추가
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

  res.json({ goods: createdGoods });
});

// [GET] 카드 속 상품 리스트 보여주기
router.get("/cart", async (req, res) => {
  const carts = await Cart.find();
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds });
  const result = carts.map((cart) => {
    return {
      quantity: cart.quantity,
      goods: goods.find((item) => item.goodsId === cart.goodsId),
    };
  });
  res.json({
    carts: result,
  });
});

// [POST]장바구니에 상품 추가
router.post("/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (quantity < 0)
    return res
      .status(400)
      .json({ message: "담을 수 없는 수량을 선택하셨습니다." });

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });

  if (existsCarts.length) {
    return res.json({
      success: false,
      errorMassage: "이미 장바구니에 존재하는 상품입니다.",
    });
  }

  await Cart.create({ goodsId: Number(goodsId), quantity: quantity });
  res.json({ success: true, message: "장바구니에 추가되었습니다." });
});

// [PUT] 장바구니에서 상품 수량 수정
router.put("/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  if (quantity < 0)
    return res
      .status(400)
      .json({ message: "담을 수 없는 수량을 선택하셨습니다." });

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });

  if (existsCarts.length) {
    await Cart.updateOne({ goodsId: goodsId }, { $set: { quantity } });
    return res.json({
      success: true,
      message: "성공적으로 수정하였습니다!",
    });
  }

  return res.json({
    success: false,
    errorMassage: "상품이 장바구니에 존재하지 않습니다.",
  });
});

// [DELETE] 장바구니에서 상품 삭제
router.delete("/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ goodsId: Number(goodsId) });

  if (existsCarts.length) {
    await Cart.deleteOne({ goodsId: goodsId });
    return res.json({
      message: "장바구니에서 상품을 삭제하였습니다.",
    });
  }

  return res.json({
    success: false,
    errorMassage: "삭제할 상품이 존재하지 않습니다.",
  });
});

module.exports = router;
