const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.send("default url for users.js GET Method");
});

router.get("/users/about", (req, res) => {
  res.send("users.js about PATH");
});

module.exports = router;
