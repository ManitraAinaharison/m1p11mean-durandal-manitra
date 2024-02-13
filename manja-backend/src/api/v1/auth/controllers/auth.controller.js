const express = require("express");
const router = express.Router();

const authenticationService = require("../services/authentication.service");
const authHelper = require("../helpers/auth.helper");
const authMiddleware = require("../middlewares/auth.middleware");
const { ROLES } = require("../schemas/user.schema");

router.post("/register", async (req, res) => {
  try {
    const { accessToken, refreshToken, responseBody } =
      await authenticationService.register(req);
    await authHelper.addTokenCookies(res, { accessToken, refreshToken });
    res.status(201).json(responseBody);
    console.log(responseBody, "inscrit et connecté");
  } catch (e) {
    console.error(e.message);
    res.status(500).json({
      message: e.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { accessToken, refreshToken, responseBody } = await authenticationService.login(req);
    await authHelper.addTokenCookies(res, { accessToken, refreshToken });
    res.status(200).json(responseBody);
    console.log("connecté");
  } catch (e) {
    console.error(e.message);
    const statusCode = e.statusCode || 500;
    res.status(statusCode).json({
      message: e.message
    });
  }
});

router.get("/users", (req, res) => {
  return res.status(200).json(authenticationService.listUsers());
});

router.get("/users-protected", authMiddleware.authorise([ROLES.CUSTOMER]), (req, res) => {
  return res.status(200).json(authenticationService.listUsers());
});

module.exports = router;
