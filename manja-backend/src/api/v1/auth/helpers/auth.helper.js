const securityUtil = require("../../../../util/security.util");

module.exports.addTokenCookies = function addTokenCookies(
  response,
  { accessToken, refreshToken }
) {
  response.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10),
  });
  response.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: parseInt(process.env.ACCESS_TOKEN_EXPIRATION, 10),
  });
};

module.exports.authorise = function authorise(permittedRoles) {
  return (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    const decodedAccesToken = securityUtil.decodeToken(accessToken);
    const decodedRefreshToken = securityUtil.decodeToken(refreshToken);

    if (!permittedRoles.include(decodedAccesToken.role)) {
      // throw new Error("not enough permission for this route");
      res.redirect("/login", "access denied");
    } else if (
      securityUtil.isTokenExpired(decodedAccesToken) &&
      securityUtil.isTokenExpired(decodedRefreshToken)
    ) {
      res.redirect("/login", "access denied");
    } else if (
      securityUtil.isTokenExpired(decodedAccesToken) &&
      !securityUtil.isTokenExpired(decodedRefreshToken)
    ){
        const {accessToken, refreshToken} = generateTokens(decodedAccesToken.username, decodedAccesToken.email, decodedAccesToken.role)
        addTokenCookies()
    }
      next();
  };
};

