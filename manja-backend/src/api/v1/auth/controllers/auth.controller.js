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
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500, "An error occured  please try again");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { accessToken, refreshToken, responseBody } =
      await authenticationService.login(req);
    console.log(accessToken, refreshToken)
    await authHelper.addTokenCookies(res, { accessToken, refreshToken });
    res.status(201).json(responseBody);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(500);
  }
});

router.get("/users", (req, res) => {
  return res.status(200).json(authenticationService.listUsers());
});

router.get("/users-protected", authMiddleware.authorise([ROLES.EMPLOYEE]), (req, res) => {
  return res.status(200).json(authenticationService.listUsers());
});

module.exports = router;
