const express = require("express");
const router = express.Router();
const employeeService = require("../services/employee.service");
const apiUtil = require("../../../../util/api.util");

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