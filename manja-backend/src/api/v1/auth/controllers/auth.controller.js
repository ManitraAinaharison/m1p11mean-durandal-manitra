const express = require("express");
const router = express.Router();

const authenticationService = require("../services/authentication.service");

router.post("/register", (req, res) => {
  const { accessToken, refreshToken, responseBody } =
    authenticationService.register(req);
  res.cookie("jwt", accessToken, {
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10),
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10),
  });
  res.status(201).json(responseBody);
});

module.exports = router;
