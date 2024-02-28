const mongoose = require('mongoose');
const { SubService } = require('./subservice.schema');

const appointmentSchema = new mongoose.Schema({
    appointmentDate: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    subService: { type: mongoose.Schema.Types.ObjectId, ref: 'SubService' },
    duration: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 1 },
    reminder: { type: Date },
    payment: {
        paymentDate: { type: Date },
        amount: { type: Number }
    },
    status: { type: Number, required: true, default: 0},
    commission: { type: Number, required: true }, 
    statusHistory: [{
        status: { type: Number, required: true },
        statusDate: { type: Date, required: true }
    }]
});

/*
 * Status meaning
 * 0: Created
 * 1: Paid
 * 2: waiting list
 * 3: Done
 * 4: Cancelled 
 */


module.exports.Appointment = mongoose.model("Appointment", appointmentSchema);