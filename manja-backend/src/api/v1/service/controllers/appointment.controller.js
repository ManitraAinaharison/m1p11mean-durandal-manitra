const express = require("express");
const router = express.Router();
const appointmentService = require("../services/appointment.service");
const apiUtil = require("../../../../util/api.util");
const authMiddleware = require("../../auth/middlewares/auth.middleware");
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

router.post("/appointments/:appointmentId/payment", (req, res) => {
    try {
        const responseBody = apiUtil.successResponse(true, {});
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.get("/users/:userId/appointments", (req, res) => {
    try {
        const userId = req.params.userId;
        responseBody = apiUtil.successResponse(true, []);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});


module.exports = router;