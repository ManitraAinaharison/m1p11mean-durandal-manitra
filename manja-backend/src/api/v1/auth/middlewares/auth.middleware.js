const securityUtil = require("../../../../util/security.util");
const helperUtil = require("../helpers/auth.helper");

module.exports.authorise = function authorise(permittedRoles) {
  return async (req, res, next) => {
    try {
      let accessToken = req.cookies.accessToken;
      let refreshToken = req.cookies.refreshToken;

			helperUtil.removeTokenCookies(res);

      if (
				(!accessToken && !refreshToken) || 
				(accessToken && !refreshToken)
			) {
				return res.status(403).json({
					message: "Token manquant."
				});
			}

			const decodedAccessToken = accessToken ? securityUtil.decodeToken(accessToken) : null;
			const decodedRefreshToken = securityUtil.decodeToken(refreshToken);

			if (
				decodedAccessToken && 
				decodedRefreshToken && 
				!securityUtil.sameUserToken(decodedAccessToken, decodedRefreshToken)
			) {
        return res.status(403).json({
          message: "Tokens invalide."
        });
			}


      if (
				(accessToken && !permittedRoles.includes(decodedAccessToken.role)) && 
				(refreshToken && !permittedRoles.includes(decodedRefreshToken.role))
			) {
				return res.status(403).json({
					message: "Accès refusé."
				});
      }

			const expiredAccessToken = accessToken ? securityUtil.isTokenExpired(accessToken, true) : null;
			const expiredRefreshToken = securityUtil.isTokenExpired(refreshToken, true);

			helperUtil.addTokenCookies(res, req.cookies );
			
			if (!accessToken || (accessToken && expiredAccessToken == true)) {

				if (refreshToken && expiredRefreshToken == true) {
					return res.status(403).json({
							message: "Session expirée. Veuillez vous reconnecter."
					});
				}

				helperUtil.removeTokenCookies(res);
				const userData = {
					username: decodedRefreshToken.username,
          email: decodedRefreshToken.email,
          role: decodedRefreshToken.role
				}
				accessToken = await securityUtil.createAccessToken(userData);
				helperUtil.addTokenCookies(res, { accessToken, refreshToken });
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
