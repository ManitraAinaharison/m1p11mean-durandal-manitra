const mongoose = require("mongoose");
const Service = require("../schemas/service.schema").Service;
const SubService = require("../schemas/subservice.schema").SubService;
const apiUtil = require("../../../../util/api.util");
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');

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
        const service = await Service.findOne({slug: serviceSlug, isDeleted: false }, '-_id -isDeleted')
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
        newService.slug = slugify(newService.name, { lower: true });
        newService.imgPath = filename;
        let service = new Service(newService);
        service = await service.save({ session });

        subServices = subServices.map(subService => {
            subService.slug = slugify(subService.name, { lower: true });
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

module.exports.updateService = async (serviceSlug, serviceData, fileName) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        let service = await Service.findOne({ slug: serviceSlug });
        if (!service) throw apiUtil.ErrorWithStatusCode("Ce service n'existe pas", 404);        

        let { subServices, subServicesToDelete, ...newService } = serviceData;
        
        // Update service
        newService.slug = slugify(newService.name, { lower: true });
        if (fileName) newService.imgPath = fileName;
        await Service.updateOne(
            { _id: service._id },
            { $set: newService },
            { session }
        );
        
        // Update subservices already present in service
        for (let i = 0; i < subServices.length; i++) {
            const subService = subServices[i];
            const oldSlug = subService.slug;
            if (oldSlug) {
                subService.slug = slugify(subService.name, { lower: true });
                await SubService.updateOne(
                    { slug: oldSlug },
                    { $set: subService },
                    { session }
                );
            }
        };

        // Get ids of subservices to delete present in service + check if every subService exists
        let subServiceIdsToDelete = [];
        for (let i = 0; i < subServicesToDelete.length; i++) {
            const subServiceSlug = subServicesToDelete[i];
            const subService = await SubService.findOne({ slug: subServiceSlug });
            if (!subService) throw apiUtil.ErrorWithStatusCode("Le sous service " + subServiceSlug + " n'existe pas", 500);
            await SubService.updateOne({ _id: subService._id }, { $set: { isDeleted: true, slug: (subService.slug + '_' + uuidv4()) } });
            subServiceIdsToDelete.push(subService._id);
        };

        // Remove from subServices key of service ids of subservices to delete
        await Service.updateOne(
            { _id: service._id },
            { $pull: { subServices: { $in: subServiceIdsToDelete } } },
            { session }
        );

        // Insert new subservices
        let insertedSubServiceIds = [];
        for (let i = 0; i < subServices.length; i++) {
            const subService = subServices[i];
            const oldSlug = subService.slug;
            if (!oldSlug) {
                subService.slug = slugify(subService.name, { lower: true });
                let newSubService = new SubService(subService);    
                newSubService = await newSubService.save(newSubService, { session });
                insertedSubServiceIds.push(newSubService._id);
            }
        }

        await Service.updateOne(
            { _id: service._id },
            { $addToSet: { subServices: { $each: insertedSubServiceIds } } },
            { session }
        );

        await session.commitTransaction();
        return await Service.findById(service._id, '-__v').populate('subServices', '-__v');
    } catch (e) {
        console.log(e);
        await session.abortTransaction();
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    } finally {
        await session.endSession();
    }
};

module.exports.deleteService = async (serviceSlug) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const service = await Service.findOne({ slug: serviceSlug, isDeleted: false });
        if (!service) throw apiUtil.ErrorWithStatusCode("Ce service n'existe pas", 404);

        const subServiceIds = service.subServices;
        for (let i = 0; i < subServiceIds.length; i++) {
            const subServiceId = subServiceIds[i];
            const subService = await SubService.findById(subServiceId);
            if (!subService) throw apiUtil.ErrorWithStatusCode("Le sous service " + subServiceSlug + " n'existe pas", 500);
            await SubService.updateOne({ _id: subServiceId }, { $set: { isDeleted: true, slug: (subService.slug + '_' + uuidv4()) } });
        }

        await Service.updateOne(
            { _id: service._id },
            { $set: { isDeleted: true, slug: (service.slug + '_' + uuidv4()) } }
        );

        await session.commitTransaction();
        return service._id;
    } catch (e) {
        console.log(e);
        await session.abortTransaction();
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    } finally {
        await session.endSession();
    }
};