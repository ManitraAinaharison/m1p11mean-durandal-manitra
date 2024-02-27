const mongoose = require("mongoose");
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const appointmentHelper = require("../helpers/appointment.helper");
const apiUtil = require("../../../../util/api.util");
const dateUtil = require("../../../../util/date.util");
const securityUtil = require("../../../../util/security.util");
const { Appointment } = require("../schemas/appointment.schema");
const { SubService } = require("../schemas/subservice.schema");
const { Employee } = require("../../auth/schemas/user.schema");
const emailService = require("../../../../email/email.service");

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
            status: { $gte: 0, $lte: 4 },
            appointmentDate: { $gte: startOfDate, $lte: endOfDate }
        });

        return appointmentsByDate;
    } catch (e) {
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
    }
}

module.exports.getAppointmentsHistoryByCustomerId = async (customerId) => {
    try {
        const appointmentsHistory = await Appointment
        .find({ client: customerId }, '-client -commission -statusHistory -__v')
        .populate({ path: 'employee', select: 'firstname lastname -_id -role' })
        .populate({ path: 'subService', select: '-_id -ptgCommission -price -duration -description' })
        .sort({ appointmentDate: -1 });
        return appointmentsHistory;
    } catch (e) {
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500)
    }
};

module.exports.payAppointment = async (customerId, appointmentId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) throw apiUtil.ErrorWithStatusCode("Ce rendez vous n'existe pas", 500);
        if (appointment.client != customerId) throw apiUtil.ErrorWithStatusCode("Ce rendez vous n'existe pas", 500);
        if (appointment.status > 0 && appointment.status < 4) throw apiUtil.ErrorWithStatusCode("Paiement déjà efféctué pour ce rendez-vous");
        if (appointment.status == 4) throw apiUtil.ErrorWithStatusCode("Vous avez déjà annulé ce rendez-vous");

        const now = Date.now();

        appointment.status = 1;
        appointment.payment = {
            paymentDate: now,
            amount: appointment.price // Change if necessary
        },
        appointment.statusHistory.push({
            status: 1,
            statusDate: now
        });
        await appointment.save();
        await session.commitTransaction();
        return appointment;
    } catch (e) {
        await session.abortTransaction();
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
    } finally {
        await session.endSession();
    }
};

module.exports.sendAppointmentReminderEmail = async () => {
    try {
        const now = new Date();
        const nowPlusTwelveHours = new Date(now.getTime() + (15 * 3600 * 1000));
        const appointments = await Appointment
        .find({ appointmentDate: { $lt: nowPlusTwelveHours }, status: 1, reminder: { $exists: false } })
        .populate({ path: 'client' })
        .populate({ path: 'subService' });

        const promises = appointments.map(async (appntmnt) => {

            const subject = "Rappel de rendez-vous";
            const templatePath = path.join(__dirname, '../../../../email/templates/appointmentReminder.ejs');
            const appointmentReminderTemplate = await fs.promises.readFile(templatePath, 'utf8');
            const templateData = {
                title: subject,
                firstname: appntmnt.client.firstname,
                lastname: appntmnt.client.lastname,
                subServiceName: appntmnt.subService.name,
                date: dateUtil.datesAreEqualWithoutTime(now, appntmnt.appointmentDate) ? "aujourd'hui" : `le ${dateUtil.toLongFrenchDate(appntmnt.appointmentDate)}`,
                hour: dateUtil.humanizeHour(appntmnt.appointmentDate)
            };
            let renderedHtml = ejs.render(appointmentReminderTemplate, templateData);
            await emailService.sendEmail(appntmnt.client.email, subject, renderedHtml);
        });

        await Promise.all(promises);

        return appointments;
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
    }
};

module.exports.getAppointment = async (customerId, appointmentId) => {
  try {
    const appointment = await Appointment.findOne(
      { _id: appointmentId, client: customerId },
      "-commission -__v",
    )
      .populate({ path: "employee", select: "firstname lastname -_id -role" })
      .populate({
        path: "subService",
        select: "-_id -ptgCommission -price -duration -description",
      });
    return appointment;
  } catch (e) {
    throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode || 500);
  }
};

module.exports.validatePayment = async (customerId, appointmentId) => {
    const session = await mongoose.startSession();
    session.startTransaction();
  try {

    let appointment = await Appointment.findOne(
      { _id: appointmentId, client: customerId },
      "-commission -__v"
    )
      .populate({ path: "employee", select: "firstname lastname -_id -role" })
      .populate({
        path: "subService",
        select: "-_id -ptgCommission -price -duration -description",
      });
    if (!appointment.subService) throw new Error("!appointment.subService");
    appointment.status = 1;
    appointment.payment = {
      paymentDate: new Date(),
      amount: appointment.subService.price,
    };
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