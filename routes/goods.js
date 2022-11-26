const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("default url for goods.js GET Method");
});

router.get("/about", (req, res) => {
  res.send("goods.js about PATH");
});

module.exports = router;
