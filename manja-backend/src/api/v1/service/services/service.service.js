const mongoose = require("mongoose");
const Service = require("../schemas/service.schema").Service;
const apiUtil = require("../../../../util/api.util");

module.exports.getListServices = async function getListServices() {
    try {
        return await Service.find({}, '-_id -subServices');
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};

module.exports.getServiceBySlug = async function getServiceBySlug(serviceSlug) {
    try {
        const service = await Service.findOne({slug: serviceSlug}, '-_id')
            .populate({ path: 'subServices', select: '-_id -ptgCommission' });
        if (!service) throw apiUtil.ErrorWithStatusCode("Ce service n'existe pas", 404);
        return service;
    } catch (e) {
        console.log(e.statusCode, e.message);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};