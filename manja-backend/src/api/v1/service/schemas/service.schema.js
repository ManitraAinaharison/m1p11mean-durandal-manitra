const mongoose = require('mongoose');
const apiUtil = require('../../../../util/api.util');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 1, max: 50 },
    slug: { type: String, required: true, unique: true, min: 1, max: 50 },
    description: { type: String, required: true, min: 1, max: 150 },
    imgPath: { type: String, required: true },
    isDeleted: { type: Boolean, required: true, default: false},
    subServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubService' }]
});


const errorHandler = async (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        let errorMessage = "";
        if (error.keyValue.slug) {
            const service = await mongoose.model("Service", serviceSchema)
                .findOne({ slug: error.keyValue.slug, isDeleted: false });
            errorMessage = `Le service «${service.name}» existe déjà.`;
        }
        throw apiUtil.ErrorWithStatusCode(errorMessage, 500);
    } else {

    }
    next();
}


serviceSchema.post('save', errorHandler);
serviceSchema.post('updateOne', errorHandler);

module.exports.Service = mongoose.model("Service", serviceSchema);