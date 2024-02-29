const express = require("express");
const router = express.Router();
const authMiddleware = require("../../auth/middlewares/auth.middleware");
const { upload } = require("../../../../upload/upload.config");
const employeeService = require("../services/employee.service");
const apiUtil = require("../../../../util/api.util");
const authHelper = require("../../auth/helpers/auth.helper");
const securityUtil = require("../../../../util/security.util");
const { ROLES } = require("../../auth/schemas/user.schema");

router.get("/employees",  authMiddleware.authorise([ROLES.MANAGER]), async (req, res) => {
    try {
        const listEmployees = await employeeService.getListEmployees();
        const responseBody = apiUtil.successResponse(true, listEmployees);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

router.get("/employees/:employeeId",  authMiddleware.authorise([ROLES.MANAGER]), async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const employee = await employeeService.getEmployeeById(employeeId);
        const responseBody = apiUtil.successResponse(true, employee);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.post("/employees",  [authMiddleware.authorise([ROLES.MANAGER]), upload('uploads/img').single('img')], async (req, res) => {
    try {
        if (!req.body.employee) throw apiUtil.ErrorWithStatusCode("Données manquantes", 500); 
        let employeeData = JSON.parse(req.body.employee);
        const fileName = req.file.filename;
        const employee = await employeeService.addNewEmployee(employeeData, fileName);
        const responseBody = apiUtil.successResponse(true, employee);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.put("/employees",  [authMiddleware.authorise([ROLES.EMPLOYEE]), upload('uploads/img').single('img')], async (req, res) => {
    try {
        let decodedRefreshToken;
        if (req.cookies.refreshToken) {
            decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
        }

        if (!req.body.employee) throw apiUtil.ErrorWithStatusCode("Données manquantes", 500); 
        let employeeData = JSON.parse(req.body.employee);
        const fileName = req.file ? req.file.filename : null;
        const employee = await employeeService.updateEmployeeItSelf(decodedRefreshToken._id, employeeData, fileName);
        const { accessToken, refreshToken } = await securityUtil.generateTokens(employee);
        await authHelper.addTokenCookies(res, { accessToken, refreshToken });
        const responseBody = apiUtil.successResponse(true, employee);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.put("/employees/work-schedules", authMiddleware.authorise([ROLES.EMPLOYEE]), async (req, res) => {
    try {
        let decodedRefreshToken;
        if (req.cookies.refreshToken) {
            decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
        }

        const employee = await employeeService.updateEmployeeWorkSchedules(decodedRefreshToken._id, req.body);
        const { accessToken, refreshToken } = await securityUtil.generateTokens(employee);
        await authHelper.addTokenCookies(res, { accessToken, refreshToken });
        const responseBody = apiUtil.successResponse(true, employee);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.put("/employees/:employeeId",  [authMiddleware.authorise([ROLES.MANAGER]), upload('uploads/img').single('img')], async (req, res) => {
    try {
        if (!req.body.employee) throw apiUtil.ErrorWithStatusCode("Données manquantes", 500); 
        let employeeId = req.params.employeeId;
        let employeeData = JSON.parse(req.body.employee);
        const fileName = req.file ? req.file.filename : null;
        const employee = await employeeService.updateEmployee(employeeId, employeeData, fileName);
        const responseBody = apiUtil.successResponse(true, employee);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.put("/employees/:employeeId/activation", authMiddleware.authorise([ROLES.MANAGER]), async (req, res) => {
    try {
        let employeeId = req.params.employeeId;
        const employee = await employeeService.updateEmployeeActivation(employeeId, req.body.active);
        const responseBody = apiUtil.successResponse(true, employee);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.get("/employees/:employeeId/schedules", async (req, res) => {
    try {
        const employeeId = req.params.employeeId;
        const schedules = await employeeService.getSchedulesOfEmployeeByGivenDate(employeeId, req.query.date);
        const responseBody = apiUtil.successResponse(true, schedules);
        res.status(200).json(responseBody);
    } catch (e) {
        console.error(e.statusCode, e.message);
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

module.exports = router;