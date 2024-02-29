const apiUtil = require("../../../../util/api.util");
const securityUtil = require("../../../../util/security.util");
const { Employee } = require("../../auth/schemas/user.schema");
const employeeHelper = require("../helpers/employee.helper");
const appointmentHelper = require("../helpers/appointment.helper");
const appointmentService = require("../services/appointment.service");
const emailService = require("../../../../email/email.service");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");

module.exports.getListEmployees = async () => {
    try {
        const employees = await Employee.find({}, '-__v');
        return employees;
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
}

module.exports.getEmployeeById = async (employeeId) => {
    try {
        const employee = await Employee.findById(employeeId, '-__v');
        if (!employee) throw apiUtil.ErrorWithStatus("Cet employé n'existe pas");
        return employee;
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
}

module.exports.addNewEmployee = async (employeeData, fileName) => {
    try {
        employeeData.imgPath = fileName;
        const newPassword = employeeHelper.generatePassword(8);
        employeeData.password = newPassword;
        let employee = new Employee(employeeData);
        employee = await employee.save();

        const subject = "Mot de passe dashboard";
        const templatePath = path.join(
            __dirname,
            "../../../../email/templates/employeePassword.ejs"
        );
        const employeePasswordTemplate = await fs.promises.readFile(
            templatePath,
            "utf8"
        );
        const templateData = {
            title: subject,
            firstname: employee.firstname,
            lastname: employee.lastname,
            password: newPassword,
        };
        let renderedHtml = ejs.render(employeePasswordTemplate, templateData);
        await emailService.sendEmail(
            employee.email,
            subject,
            renderedHtml
        );

        return await Employee.findById(employee._id, '-__v');
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};

module.exports.updateEmployee = async (employeeId, employeeData, fileName) => {
    try {
        let employee = await Employee.findById(employeeId);
        if (!employee) throw apiUtil.ErrorWithStatusCode("Cet employé n'existe pas", 404);
        if (fileName) employeeData.imgPath = fileName;
        await Employee.updateOne(
            { _id: employee._id },
            { $set: employeeData }
        );
        
        return await Employee.findById(employee._id, '-__v');
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
}

module.exports.updateEmployeeItSelf = async (employeeId, employeeData, fileName) => {
    try {
        let employee = await Employee.findById(employeeId);
        if (!employee) throw apiUtil.ErrorWithStatusCode("Cet employé n'existe pas", 404);
        if (fileName) employeeData.imgPath = fileName;
        if (employeeData.password) employeeData.password = securityUtil.hash(employeeData.password);
        await Employee.updateOne(
            { _id: employee._id },
            { $set: employeeData }
        );
        
        return await Employee.findById(employee._id, '-__v').populate('subServices');
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
}

module.exports.updateEmployeeWorkSchedules = async (employeeId, data) => {
    try {
        let employee = await Employee.findById(employeeId);
        if (!employee) throw apiUtil.ErrorWithStatusCode("Cet employé n'existe pas", 404);
        
        const currWorkSchedule = employee.workSchedule.findIndex(workSchedule => workSchedule.day == data.day);
        if(currWorkSchedule >= 0) {
            await Employee.updateOne(
                { _id: employeeId, 'workSchedules.day': 1 }, 
                { $set: { 
                    'workSchedules.$.schedule.0.start': new Date('1970-01-01T' + data.start),
                    'workSchedules.$.schedule.0.end': new Date('1970-01-01T' + data.end)
                }
            });
        } else {
            const newSchedule = {
                day: data.day, 
                schedule: [
                    {
                        start: new Date('1970-01-01T' + data.start),
                        end: new Date('1970-01-01T' + data.end)
                    }
                ]
            };
            await Employee.updateOne(
                { _id: employeeId },
                { $push: { workSchedule: newSchedule } }
            );
        }
        
        return await Employee.findById(employee._id, '-__v').populate('subServices');
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
}

module.exports.updateEmployeeActivation = async (employeeId, active) => {
    try {
        let employee = await Employee.findById(employeeId);
        if (!employee) throw apiUtil.ErrorWithStatusCode("Cet employé n'existe pas", 404);
        await Employee.updateOne(
            { _id: employee._id },
            { $set: { isActive: active } }
        );
        return await Employee.findById(employee._id, '-__v');
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};

module.exports.getSchedulesOfEmployeeByGivenDate = async (employeeId, dateStr) => {
    try {
        let givenDate = dateStr;
        if (!givenDate) throw apiUtil.ErrorWithStatusCode("La date doit être fournies", 500);
        givenDate = new Date(givenDate);

        const employee = await Employee.findById(employeeId, '-workSchedule.schedule._id');
        if (!employee) throw apiUtil.ErrorWithStatusCode("Cet employee n'existe pas", 500);

        
        const scheduleOfTheDayIndex = employeeHelper.getScheduleOfTheDayIndex(employee.workSchedule, givenDate);
        if (scheduleOfTheDayIndex < 0) {
            const options = { weekday: "long", timeZone: "UTC" };
            const frenchDayName = givenDate.toLocaleDateString(
              "fr-FR",
              options
            );
            throw new apiUtil.ErrorWithStatusCode(
              "Cet employé ne travaille pas un " + frenchDayName,
              500
            );
        }

        const appointmentsOfEmployeeByDate = await appointmentService.getAppointmentsOfEmployeeByDate(employeeId, givenDate);
        let appointmentsDateIntervals = [];
        appointmentsOfEmployeeByDate.forEach((appointment) => {
            const interval = appointmentHelper.getDateIntervalOfAppoiment(appointment);
            appointmentsDateIntervals.push(interval);
        })
        return {
            workSchedules: employee.workSchedule[scheduleOfTheDayIndex].schedule,
            unavailableSchedules: appointmentsDateIntervals
        };
    } catch (e) {
        console.log(e);
        throw apiUtil.ErrorWithStatusCode(e.message, e.statusCode);
    }
};