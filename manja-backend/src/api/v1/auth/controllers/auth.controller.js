const express = require("express");
const router = express.Router();

router.get("/v1/profile", (req, res) => {
  res.send("auth path");
});

module.exports = router;
