const securityUtil = require("../../../../util/security.util");
const helperUtil = require("../helpers/auth.helper");

module.exports.authorise = function authorise(permittedRoles) {
  return async (req, res, next) => {
    try {
      const accessToken = req.cookies.accessToken;
      const refreshToken = req.cookies.refreshToken;

			helperUtil.removeTokenCookies(res);

      if ((!accessToken && !refreshToken) || (accessToken && !refreshToken)) {
				return res.status(403).json({
					message: "Token manquant."
				});
			}

			const decodedAccessToken = accessToken ? securityUtil.decodeToken(accessToken) : null;
			const decodedRefreshToken = securityUtil.decodeToken(refreshToken);

			if (decodedAccessToken && decodedRefreshToken && !securityUtil.sameUserToken(decodedAccessToken, decodedRefreshToken)) {
        return res.status(403).json({
          message: "Tokens invalide."
        });
			}


      if ((accessToken && !permittedRoles.includes(decodedAccessToken.role)) && (refreshToken && !permittedRoles.includes(decodedRefreshToken.role))) {
				return res.status(403).json({
					message: "Accès refusé."
				});
      }

			const expiredAccessToken = accessToken ? securityUtil.isTokenExpired(accessToken, true) : null;
			const expiredRefreshToken = securityUtil.isTokenExpired(refreshToken, true);

			console.log(expiredAccessToken, expiredRefreshToken);
			if ((accessToken && expiredAccessToken == true) || (refreshToken && expiredRefreshToken == true)) {
				return res.status(403).json({
						message: "Session expirée. Veuillez vous reconnecter."
				});
			}

			helperUtil.addTokenCookies(res, req.cookies );
			
			if (!accessToken) {
				helperUtil.removeTokenCookies(res);
				const userData = {
					username: decodedRefreshToken.username,
          email: decodedRefreshToken.email,
          role: decodedRefreshToken.role
				}
				const newTokens = await securityUtil.generateTokens(userData);
				helperUtil.addTokenCookies(res, newTokens);
			}

      next();
    } catch (e) {
      console.error(e.message);
      return res.status(500).json({
        message: e.message
      });
    }
  };
};
