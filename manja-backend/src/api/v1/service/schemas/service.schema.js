const mongoose = require('mongoose');
const SubService = require('./subservice.schema');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 1, max: 50 },
    slug: { type: String, required: true, unique: true, min: 1, max: 50 },
    description: { type: String, required: true, min: 1, max: 150 },
    imgPath: { type: String, required: true },
    subServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubService' }]
});


module.exports.Service = mongoose.model("Service", serviceSchema);