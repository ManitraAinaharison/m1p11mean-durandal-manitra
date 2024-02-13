const securityUtil = require("../../../../util/security.util");

function addTokenCookies(
  response,
  { accessToken, refreshToken }
) {
  response.cookie("accessToken", accessToken, {
    secure: true,
    sameSite: "none"
  });
  response.cookie("refreshToken", refreshToken, {
    secure: true,
    sameSite: "none"
  });
};

function removeTokenCookies(response) {
  response.clearCookie("accessToken");
  response.clearCookie("refreshToken");
};

module.exports.addTokenCookies = addTokenCookies;
module.exports.removeTokenCookies = removeTokenCookies;