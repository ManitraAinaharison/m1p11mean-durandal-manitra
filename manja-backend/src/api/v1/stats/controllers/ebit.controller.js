const express = require("express");
const router = express.Router();
const ebitService = require("../services/ebit.service");
const apiUtil = require("../../../../util/api.util");
const authMiddleware = require("../../auth/middlewares/auth.middleware");
const { ROLES } = require("../../auth/schemas/user.schema");


router.get("/ebit", async (req, res) => {
    try {
        const ebitList = await ebitService.getListOfEbit();  
        const responseBody = apiUtil.successResponse(true, ebitList);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.post("/ebit", async (req, res) => {
    try {
        const ebit = await ebitService.addNewEbit(req.body);  
        const responseBody = apiUtil.successResponse(true, ebit);
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});


module.exports = router;