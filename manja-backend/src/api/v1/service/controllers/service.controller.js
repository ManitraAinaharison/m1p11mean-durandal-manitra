const express = require("express");
const router = express.Router();

const serviceService = require("../services/service.service");
const apiUtil = require("../../../../util/api.util");

router.get("/services", async (req, res) => {
    try {
        const listServices = await serviceService.getListServices();
        const responseBody = apiUtil.successResponse(true, listServices);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

router.get("/services/:serviceSlug", async (req, res) => {
    try {
        const serviceSlug = req.params.serviceSlug;
        const service = await serviceService.getServiceBySlug(serviceSlug);
        const responseBody = apiUtil.successResponse(true, service);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

/*
 * NOT IMPLEMENTED ENDPOINT
 */

router.get("/services/:serviceId/subservices", (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        responseBody = apiUtil.successResponse(true, []);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

router.get("/services/:serviceId/subservices/:subserviceId", (req, res) => {
    try {
        const serviceId = req.params.serviceId;
        const subserviceId = req.params.subserviceId;
        responseBody = apiUtil.successResponse(true, []);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(500).json({
        message: e.message
        });
    }
});


router.post("/services", (req, res) => {
    try {
        responseBody = apiUtil.successResponse(true, {});
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

module.exports = router;