const express = require("express");
const router = express.Router();

const authenticationService = require("../services/authentication.service");
const authHelper = require("../helpers/auth.helper");
const { ROLES } = require("../schemas/user.schema");

router.post("/register", async (req, res) => {
    try {
        const { accessToken, refreshToken, responseBody } = await authenticationService.register(req);
        await authHelper.addTokenCookies(res, { accessToken, refreshToken });
        res.status(201).json(responseBody);
        console.log(responseBody.payload.username, "inscrit et connecté");
    } catch (e) {
        console.error(e.statusCode, e.message);
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const roles = [ROLES.CUSTOMER];
        const { accessToken, refreshToken, responseBody } = await authenticationService.login(req, roles);
        await authHelper.addTokenCookies(res, { accessToken, refreshToken });
        res.status(200).json(responseBody);
        console.log("client connecté");
    } catch (e) {
        console.error(e, e.statusCode, e.message);
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.post("/admin/login", async (req, res) => {
    try {
        const roles = [ROLES.EMPLOYEE, ROLES.MANAGER];
        const { accessToken, refreshToken, responseBody } = await authenticationService.login(req, roles);
        await authHelper.addTokenCookies(res, { accessToken, refreshToken });
        res.status(200).json(responseBody);
        console.log("admin connecté");
    } catch (e) {
        console.error(e.statusCode, e.message);
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});


module.exports = router;