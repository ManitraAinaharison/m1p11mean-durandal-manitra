const mongoose = require("mongoose");
const Service = require("../schemas/service.schema").Service;
const SubService = require("../schemas/subservice.schema").SubService;
const apiUtil = require("../../../../util/api.util");
const slugify = require('slugify');

module.exports.getListServices = async function getListServices() {
    try {
        return await Service.find({ isDeleted: false }, '-_id -subServices');
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};

module.exports.getServiceBySlug = async function getServiceBySlug(serviceSlug, isManager) {
    try {
        let toExcludeToSubService = '-_id';
        if(!isManager) toExcludeToSubService  += '-ptgCommission';
        const service = await Service.findOne({slug: serviceSlug, isDeleted: false }, '-_id')
            .populate({ path: 'subServices', select: toExcludeToSubService });
        if (!service) throw apiUtil.ErrorWithStatusCode("Ce service n'existe pas", 404);
        return service;
    } catch (e) {
        console.log(e.statusCode, e.message);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};

module.exports.addNewService = async (serviceData, filename) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let { subServices, ...newService } = serviceData;
        newService.slug = slugify(newService.name);
        newService.imgPath = filename;
        let service = new Service(newService);
        service = await service.save({ session });

        subServices = subServices.map(subService => {
            subService.slug = slugify(subService.name);
            return new SubService(subService);
        });
        const insertedSubServices = await SubService.insertMany(subServices, { session });

        const insertedSubServiceIds = insertedSubServices.map(subService => subService._id);

        await Service.updateOne(
            { _id: service._id },
            { $addToSet: { subServices: { $each: insertedSubServiceIds } } },
            { session }
        );

        await session.commitTransaction();
        return await Service.findById(service._id, '-__v').populate('subServices', '-__v').lean();
    } catch (e) {
        await session.abortTransaction();
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    } finally {
        await session.endSession();
    }
}

module.exports.updateService = async (serviceId, serviceData, fileName) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let service = await Service.findById(serviceId);
        if (!service) throw apiUtil.ErrorWithStatusCode("Ce service n'existe pas", 404);        

        let { subServicesToUpdate, subServicesToDelete, subServicesToAdd, ...newService } = serviceData;
        newService.slug = slugify(newService.name);
        if (fileName) newService.imgPath = fileName;
        await Service.updateOne(
            { _id: service._id },
            { $set: newService },
            { session }
        );

        for (let i = 0; i < subServicesToUpdate.length; i++) {
            const subService = subServicesToUpdate[i];
            subService.slug = slugify(subService.name);
            await SubService.updateOne(
                { _id: subService._id },
                { $set: subService },
                { session }
            );
        };

        let insertedSubServiceIds = [];
        console.log(subServicesToAdd);
        for (let i = 0; i < subServicesToAdd.length; i++) {
            const subService = subServicesToAdd[i];
            subService.slug = slugify(subService.name);
            let newSubService = new SubService(subService);
            newSubService = await newSubService.save(newSubService, { session });
            insertedSubServiceIds.push(newSubService._id);
        };

        await Service.updateOne(
            { _id: service._id },
            { $addToSet: { subServices: { $each: insertedSubServiceIds } } },
            { session }
        );

        await Service.updateOne(
            { _id: service._id },
            { $pull: { subServices: { $in: subServicesToDelete } } },
            { session }
        );

        await session.commitTransaction();
        return await Service.findById(serviceId, '-__v').populate('subServices', '-__v');
    } catch (e) {
        await session.abortTransaction();
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    } finally {
        await session.endSession();
    }
};

module.exports.deleteService = async (serviceId) => {
    try {
        const service = await Service.findById(serviceId);
        if (!service) throw apiUtil.ErrorWithStatusCode("Ce service n'existe pas", 404);

        await Service.updateOne(
            { _id: service._id },
            { $set: { isDeleted: true } }
        );

        return serviceId;
    } catch (e) {
        console.log(e.statusCode, e.message);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};