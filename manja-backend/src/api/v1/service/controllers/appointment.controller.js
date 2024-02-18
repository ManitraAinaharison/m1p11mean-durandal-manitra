const express = require("express");
const router = express.Router();
const appointmentService = require("../services/appointment.service");
const apiUtil = require("../../../../util/api.util");
const authMiddleware = require("../../auth/middlewares/auth.middleware");
const securityUtil = require("../../../../util/security.util");
const { ROLES } = require("../../auth/schemas/user.schema");

router.post("/appointments", authMiddleware.authorise([ROLES.CUSTOMER]), async (req, res) => {
    try {
        const appointment = await appointmentService.insertAppointment(req);  
        const responseBody = apiUtil.successResponse(true, appointment);
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.post("/appointments/:appointmentId/payment", authMiddleware.authorise([ROLES.CUSTOMER]), async (req, res) => {
    try {
        const appointmentId = req.params.appointmentId;
        const decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
        const appointment = await appointmentService.payAppointment(decodedRefreshToken._id, appointmentId);
        const responseBody = apiUtil.successResponse(true, appointment);
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.get("/appointments/history", authMiddleware.authorise([ROLES.CUSTOMER]), async (req, res) => {
    try {
        const decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
        const appointmentsHistory = await appointmentService.getAppointmentsHistoryByCustomerId(decodedRefreshToken._id);
        responseBody = apiUtil.successResponse(true, appointmentsHistory);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});


module.exports = router;