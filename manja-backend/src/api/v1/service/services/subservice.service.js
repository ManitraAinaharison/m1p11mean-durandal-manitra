const mongoose = require("mongoose");
const SubService = require("../schemas/subservice.schema").SubService;
const { Employee } = require("../../auth/schemas/user.schema");
const apiUtil = require("../../../../util/api.util");

module.exports.getEmployeesBySubService = async function getEmployeesBySubService(subServiceSlug, employeName) {
    try {
        const subService = await SubService.findOne({slug: subServiceSlug}, 'id');
        if(!subService) throw apiUtil.ErrorWithStatusCode("Ce sous service n'existe pas", 404);
        const nameRegex = new RegExp(`(.*)(${employeName.split(' ').join('|')})(.*)`, 'i');
        return await Employee.find({ subServices: { $in: [subService._id] }, $or: [{ lastname: nameRegex }, { firstname: nameRegex }]});
    } catch (e) {
        console.log(e.statusCode, e.message);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};