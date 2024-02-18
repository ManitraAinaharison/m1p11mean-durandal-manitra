const mongoose = require('mongoose');

const subServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 1, max: 50 },
    slug: { type: String, required: true, unique: true, min: 1, max: 50 },
    description: { type: String, required: true, min: 1, max: 150 },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
    ptgCommission: { type: Number, required: true, min: 1 }
});


module.exports.SubService = mongoose.model("SubService", subServiceSchema);