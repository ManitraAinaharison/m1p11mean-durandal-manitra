const securityUtil = require("../../../../util/security.util");

function addTokenCookies(
  response,
  { accessToken, refreshToken }
) {
  response.cookie("accessToken", accessToken, {
    // httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION),
  });
  response.cookie("refreshToken", refreshToken, {
    // httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: parseInt(process.env.REFRESH_TOKEN_EXPIRATION),
  });
};

function removeTokenCookies(response) {
  response.clearCookie("accessToken");
  response.clearCookie("refreshToken");
};

module.exports.addTokenCookies = addTokenCookies;
module.exports.removeTokenCookies = removeTokenCookies;