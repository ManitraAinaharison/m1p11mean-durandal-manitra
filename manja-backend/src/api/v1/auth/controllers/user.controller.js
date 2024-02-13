const express = require("express");
const router = express.Router();
const securityUtil = require("../../../../util/security.util");
const authMiddleware = require("../middlewares/auth.middleware");
const { ROLES } = require("../schemas/user.schema");

router.post("/tehe", (req, res) => {
  try {
    
  } catch (error) {
    return res.status(400)
  }
});

router.get("/user", authMiddleware.authorise([ROLES.CUSTOMER]), (req, res) => {
  try {
    const decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
    const { iat, exp, ...curentUser} = decodedRefreshToken;
    res.status(200).json({
      success: true,
      payload: curentUser
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;
