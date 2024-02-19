const express = require("express");
const router = express.Router();

const subServiceService = require("../services/subservice.service");
const apiUtil = require("../../../../util/api.util");

router.get("/sub-services/:subServiceSlug/employees", async (req, res) => {
    try {
        const subServiceSlug = req.params.subServiceSlug;
        const employees = await subServiceService.getEmployeesBySubService(subServiceSlug, req.query.name || "");
        const responseBody = apiUtil.successResponse(true, employees);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

module.exports = router;