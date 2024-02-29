const securityUtil = require("../../../../util/security.util");
const helperUtil = require("../helpers/auth.helper");

module.exports.authorise = function authorise(permittedRoles) {
	return async (req, res, next) => {
		try {
			let accessToken = req.cookies.accessToken;
			let refreshToken = req.cookies.refreshToken;

			helperUtil.removeTokenCookies(res);
			console.log(accessToken, refreshToken);
			if ((!accessToken && !refreshToken) || (accessToken && !refreshToken)) {
				return res.status(403).json({
					message: "" // Token manquant.
				});
			}

			const decodedAccessToken = accessToken ? securityUtil.decodeToken(accessToken) : null;
			const decodedRefreshToken = securityUtil.decodeToken(refreshToken);

			if (decodedAccessToken && decodedRefreshToken && !securityUtil.sameUserToken(decodedAccessToken, decodedRefreshToken)) {
				helperUtil.addTokenCookies(res, req.cookies );
				return res.status(403).json({
					message: "Tokens invalide. Veuillez vous reconnecter"
				});
			}


			if ((accessToken && !permittedRoles.includes(decodedAccessToken.role)) && (refreshToken && !permittedRoles.includes(decodedRefreshToken.role))) {
				helperUtil.addTokenCookies(res, req.cookies );
				return res.status(403).json({
					message: "Accès refusé."
				});
			}

			const expiredAccessToken = accessToken ? securityUtil.isTokenExpired(accessToken, true) : null;
			const expiredRefreshToken = securityUtil.isTokenExpired(refreshToken, true);

			helperUtil.addTokenCookies(res, req.cookies );
				
			if (!accessToken || (accessToken && expiredAccessToken == true)) {

				if (refreshToken && expiredRefreshToken == true) {
					helperUtil.addTokenCookies(res, req.cookies );
					return res.status(403).json({
							message: "Session expirée. Veuillez vous reconnecter."
					});
				}

				helperUtil.removeTokenCookies(res);
				const { password: pwd, __t, __v, iat, exp, ...userData } = decodedRefreshToken;
				accessToken = await securityUtil.createAccessToken(userData);
				helperUtil.addTokenCookies(res, { accessToken, refreshToken });
			}

			next();
		} catch (e) {
			console.error(e, e.message);
			return res.status(500).json({
				message: e.message
			});
		}
	};
};
