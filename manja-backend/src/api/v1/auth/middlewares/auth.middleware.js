const securityUtil = require("../../../../util/security.util");
const helperUtil = require("../helpers/auth.helper");

module.exports.authorise = function authorise(permittedRoles) {
  return async (req, res, next) => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      if (!accessToken && !refreshToken) { // no-token
        return res.redirect(403, "/login", "access denied");
      }

      const decodedAccesToken = securityUtil.decodeToken(accessToken);
      const decodedRefreshToken = securityUtil.decodeToken(refreshToken);

      const accessExpired = securityUtil.isTokenExpired(accessToken);
      const refreshExpiredOrNull = securityUtil.isTokenExpired(
        refreshToken,
        true
      );

      if (!securityUtil.sameUserToken(decodedAccesToken, decodedRefreshToken)) {
        res.clearCookie("refreshToken");
      }

      if (!permittedRoles.includes(decodedAccesToken.role)) {
        // unsuffisent permission
        return res.redirect("/login", 403);
      } else if (
        // both tokens expired
        accessExpired &&
        refreshExpiredOrNull
      ) {
        console.info(
          `tokens expired at ${new Date(
            decodedAccesToken.exp * 1000
          )} - ${new Date(decodedRefreshToken.exp * 1000)}`
        );
        helperUtil.removeTokenCookies(res);
        return res.redirect("/login", 403);
      } else if (
        // accessToken expired but refreshTokenStill valid
        accessExpired &&
        !refreshExpiredOrNull
      ) {
      }
      const newTokens = await securityUtil.generateTokens(
        decodedAccesToken.username,
        decodedAccesToken.email,
        decodedAccesToken.role
      );
      helperUtil.addTokenCookies(res, { ...newTokens });
      next();
    } catch (e) {
      console.log(e);
      return res.status(500);
    }
  };
};
