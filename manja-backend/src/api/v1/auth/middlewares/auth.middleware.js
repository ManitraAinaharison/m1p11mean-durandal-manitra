const securityUtil = require("../../../../util/security.util");
const helperUtil = require("../helpers/auth.helper");

module.exports.authorise = function authorise(permittedRoles) {
  return (req, res, next) => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

      if (!accessToken && !refreshToken) {
        return res.redirect(403, "/login", "access denied");
      }

      const decodedAccesToken = securityUtil.decodeToken(accessToken);
      const decodedRefreshToken = securityUtil.decodeToken(refreshToken);

      if (!securityUtil.sameUserToken(decodedAccesToken, decodedRefreshToken)) {
        res.clearCookie("refreshToken");
      }
      
      if (!permittedRoles.includes(decodedAccesToken.role)) { // unsuffisent permission
        return res.redirect(403, "/login", "access denied");
      } else if ( // both tokens expired
        securityUtil.isTokenExpired(accessToken) &&
        securityUtil.isTokenExpired(refreshToken, true)
      ) {
        
        console.log(
          `tokens expired at ${new Date(decodedAccesToken.exp*1000)} - ${new Date(
            decodedAccesToken.exp*1000
          )}`
        );
        helperUtil.removeTokenCookies(res);
        return res.redirect(403, "/login", "please log in again");
      } else if ( // accessToken expired but refreshTokenStill valid
        securityUtil.isTokenExpired(accesToken) &&
        !securityUtil.isTokenExpired(refreshToken, true)
      ) {
        const { accessToken, refreshToken } = generateTokens(
          decodedAccesToken.username,
          decodedAccesToken.email,
          decodedAccesToken.role
        );
        helperUtil.addTokenCookies(res, { accessToken, refreshToken });
        next();
      }
      next();
    } catch (e) {
      console.log(e);
      res.status(500).redirect("/login");
    }
  };
};
