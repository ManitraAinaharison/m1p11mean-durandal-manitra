const express = require("express");
const router = express.Router();
const statsService = require("../services/stats.service");
const apiUtil = require("../../../../util/api.util");
const authMiddleware = require("../../auth/middlewares/auth.middleware");
const { ROLES } = require("../../auth/schemas/user.schema");


router.get("/stats/sales", async (req, res) => {
    try {
        const sales = await statsService.getCurrentSales();  
        const responseBody = apiUtil.successResponse(true, sales);
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});


router.get("/stats/total-employee-working-hours", async (req, res) => {
    try {
        const sales = await statsService.getTotalEmployeeWorkingHours();
        const responseBody = apiUtil.successResponse(true, sales);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});


router.get("/stats/bookings", async (req, res) => {
    try {
        const nbrMonth = req.query.nbrMonth;
        const sales = await statsService.getSalesAndAppointmentsNumberForLast(nbrMonth);  
        const responseBody = apiUtil.successResponse(true, sales);
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});


module.exports = router;