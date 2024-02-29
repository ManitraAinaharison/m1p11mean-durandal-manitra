const express = require("express");
const router = express.Router();

const serviceService = require("../services/service.service");
const authMiddleware = require("../../auth/middlewares/auth.middleware");
const { upload } = require("../../../../upload/upload.config");
const apiUtil = require("../../../../util/api.util");
const securityUtil = require("../../../../util/security.util");
const { ROLES } = require("../../auth/schemas/user.schema");

router.get("/services", async (req, res) => {
    try {
        let isManager = false;
        if (req.cookies.refreshToken) {
            const decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
            if (decodedRefreshToken.role == ROLES.MANAGER) isManager = true;
        }
        const minimalDataOnly = req.query.minimalData;
        const listServices = await serviceService.getListServices(isManager, minimalDataOnly);
        const responseBody = apiUtil.successResponse(true, listServices);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(500).json({
            message: e.message
        });
    }
});

router.get("/services/slugs", async (req, res) => {
    try {
        const listServicesSlugs = await serviceService.getServicesSlugs();
        const responseBody = apiUtil.successResponse(true, listServicesSlugs);
        res.status(200).json(responseBody);
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: e.message
        });
    }
});

router.get("/services/:serviceSlug", async (req, res) => {
    try {
        let isManager = false;
        if (req.cookies.refreshToken) {
            const decodedRefreshToken = securityUtil.decodeToken(req.cookies.refreshToken);
            if (decodedRefreshToken.role == ROLES.MANAGER) isManager = true;
        }

        const serviceSlug = req.params.serviceSlug;
        const service = await serviceService.getServiceBySlug(serviceSlug, isManager);
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
// NOT IMPLEMENT ENDPOINT

router.post("/services",  [authMiddleware.authorise([ROLES.MANAGER]), upload('uploads/img').single('img')], async (req, res) => {
    try {
        if (!req.body.service) throw apiUtil.ErrorWithStatusCode("Données manquantes", 500); 
        let serviceData = JSON.parse(req.body.service);
        const fileName = req.file.filename;
        const newService = await serviceService.addNewService(serviceData, fileName);
        responseBody = apiUtil.successResponse(true, newService);
        res.status(201).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.put("/services/:serviceSlug", [authMiddleware.authorise([ROLES.MANAGER]), upload('uploads/img').single('img')], async (req, res) => {
    try {
        if (!req.body.service) throw apiUtil.ErrorWithStatusCode("Données manquantes", 500); 
        let serviceSlug = req.params.serviceSlug;
        let serviceData = JSON.parse(req.body.service);
        const fileName = req.file ? req.file.filename : null;
        const newService = await serviceService.updateService(serviceSlug, serviceData, fileName);
        responseBody = apiUtil.successResponse(true, newService);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

router.delete("/services/:serviceSlug", authMiddleware.authorise([ROLES.MANAGER]), async (req, res) => {
    try {
        let serviceSlug = req.params.serviceSlug;
        const id = await serviceService.deleteService(serviceSlug);
        responseBody = apiUtil.successResponse(true, id);
        res.status(200).json(responseBody);
    } catch (e) {
        res.status(e.statusCode || 500).json({
            message: e.message
        });
    }
});

module.exports = router;