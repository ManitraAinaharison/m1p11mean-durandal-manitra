const mongoose = require("mongoose");
const appointmentHelper = require("../helpers/appointment.helper");
const apiUtil = require("../../../../util/api.util");
const securityUtil = require("../../../../util/security.util");
const { Appointment } = require("../schemas/appointment.schema");
const { SubService } = require("../schemas/subservice.schema");
const { Employee } = require("../../auth/schemas/user.schema");

module.exports.insertAppointment = async (req) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const currentUser = securityUtil.decodeToken(req.cookies.refreshToken);

        let { appointmentDate, employeeId, subServiceSlug } = req.body;
        appointmentDate = new Date(appointmentDate);

        const subService = await SubService.findOne({ slug: subServiceSlug });
        if (!subService) throw apiUtil.ErrorWithStatusCode("Ce sous service n'existe pas", 500);

        const employee = await Employee.findById(employeeId);
        if (!employee) throw apiUtil.ErrorWithStatusCode("Cet employé n'existe pas", 500);

        if(!employee.subServices.includes(subService._id)) 
            throw apiUtil.ErrorWithStatusCode("Données incohérentes: Cet employé ne prend pas en charge le service " + subService.name, 500);

        if(appointmentDate <= Date.now()) 
            throw apiUtil.ErrorWithStatusCode("La date de rendez-vous doit être superieur à la data actuel", 500);

        if(!appointmentHelper.isInEmployeeWorkingDay(employee.workSchedule, appointmentDate)) {
            const options = { weekday: 'long', timeZone: 'UTC' };
            const frenchDayName = appointmentDate.toLocaleDateString('fr-FR', options);            
            throw new apiUtil.ErrorWithStatusCode("Cet employé ne travaille pas un " + frenchDayName, 500);
        }
        
        if(!appointmentHelper.isInEmployeeSchedule(employee.workSchedule, appointmentDate, subService.duration)) 
            throw apiUtil.ErrorWithStatusCode("Le rendez-vous doit être entre les horaires de travail de l'employé", 500);

        const appointmentsPresenOnTheChosenDate = await this.getAppointmentsOfEmployeeByDate(employeeId, appointmentDate);
        if(!appointmentHelper.notOverlapAnotherAppointment(appointmentsPresenOnTheChosenDate, appointmentDate, subService.duration))
            throw apiUtil.ErrorWithStatusCode("Un rendez-vous est déjà calé à cette heure", 500);

        let appointment = new Appointment({
            appointmentDate: appointmentDate,
            client: currentUser._id,
            employee: employee._id,
            subService: subService._id,    
            duration: subService.duration,
            price: subService.price,
            commission: subService.price * subService.ptgCommission / 100,
            statusHistory: [
                {
                    status: 0,
                    statusDate: Date.now()
                }
            ]
        });
        appointment = await appointment.save({ session });
        await session.commitTransaction();
        return appointment;
    } catch (e) {
        console.log(e, e.statusCode, e.message);
        await session.abortTransaction();
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    } finally {
        await session.endSession();
    }
};

module.exports.getAppointmentsOfEmployeeByDate = async (employeeId, date) => {
    try {
        let startOfDate = new Date(date.getTime());
        startOfDate.setHours(0, 0, 0, 0);

        let endOfDate = new Date(date.getTime());
        endOfDate.setHours(23, 59, 59, 999);

        const appointmentsByDate = await Appointment.find({
            employee: employeeId,
            status: { $gt: 0, $lt: 4 },
            appointmentDate: { $gte: startOfDate, $lte: endOfDate }
        });

        return appointmentsByDate;
    } catch (e) {
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
    }
}