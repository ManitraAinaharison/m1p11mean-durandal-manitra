const mongoose = require('mongoose');

const ebitSchema = new mongoose.Schema({
    designation: { type: String, required: true },
    ebitDate: { type: Date, required: true },
    month: { type: Number, required: true, min: 0, max: 11 },
    year: { type: Number, required: true, min: 0 },
    expenses: [{
        designation: { type: String, required: true},
        amount: { type: Number, required: true, min: 0 }
    }],
    sales: { type: Number, required: true, min: 0 },
    totalProfit: { type: Number, required: true, min: 0 }
});

module.exports.EbitSchema = mongoose.model("EbitSchema", ebitSchema);