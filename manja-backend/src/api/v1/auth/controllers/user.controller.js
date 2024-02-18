const express = require("express");
const router = express.Router();
const securityUtil = require("../../../../util/security.util");
const apiUtil = require("../../../../util/api.util");

router.get("/user", (req, res) => {
    try {
        const decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
        const { password: pwd, __t, __v, _id, iat, exp, ...currentUser } = decodedRefreshToken;
        const responseBody = apiUtil.successResponse(true, currentUser);
        res.status(200).json(responseBody);
    } catch (e) {
        console.error(e.statusCode, e.message);
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.get("/employees/:employeeId/schedules", (req, res) => {
    try {
        const date = req.query.date;
        const responseBody = apiUtil.successResponse(true, []);
        res.status(200).json(responseBody);
    } catch (e) {
        console.error(e.statusCode, e.message);
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

module.exports = router;