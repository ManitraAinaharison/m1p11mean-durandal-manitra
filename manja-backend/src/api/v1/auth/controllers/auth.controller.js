const express = require("express");
const router = express.Router();

const authenticationService = require("../services/authentication.service");
const authHelper = require('../helpers/auth.helper')

router.post("/register", (req, res) => {
  try {
    const { accessToken, refreshToken, responseBody } =
      authenticationService.register(req);
    authHelper.addTokenCookies(res, { accessToken, refreshToken});
    res.status(201).json(responseBody);
  } catch (e) {
    console.log(e.message)
    res.status(500, "An error occured  please try again");
  }
});

router.post("/login", (req, res) => {
  try {
    const { accessToken, refreshToken, responseBody } =
      authenticationService.login(req);
    authHelper.addTokenCookies(res, { accessToken, refreshToken });
    res.status(201).json(responseBody);
  } catch (e) {
    console.log(e.message);
    res.status(500, "An error occured  please try again");
  }
});

router.get("/users", (req, res)=>{
  
  return res
    .status(200)
    .json(authenticationService.listUsers());
})

module.exports = router;
