const mongoose = require('mongoose');
const Service = require('./service.schema').Service;
const apiUtil = require('../../../../util/api.util');

const subServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 1, max: 50 },
    slug: { type: String, required: true, unique: true, min: 1, max: 50 },
    description: { type: String, required: true, min: 1, max: 150 },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
    ptgCommission: { type: Number, required: true, min: 1 },
    isDeleted: { type: Boolean, required: true, default: false},
});

const errorHandler = async (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        let errorMessage = "";
        if (error.keyValue.slug) {
            const subService = await mongoose.model("SubService", subServiceSchema)
                .findOne({ slug: error.keyValue.slug, isDeleted: false });

            const service = await Service.findOne({ subServices: subService._id }, 'name');
            console.log(subService.name, service);

            errorMessage = `Le sous service «${subService.name}» existe déjà dans le service «${service.name}».`;
        }
        throw apiUtil.ErrorWithStatusCode(errorMessage, 500);
    } else {

    }
    next();
}


subServiceSchema.post('save', errorHandler);
subServiceSchema.post('updateOne', errorHandler);


module.exports.SubService = mongoose.model("SubService", subServiceSchema);