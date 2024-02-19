const apiUtil = require("../../../../util/api.util");
const { Employee } = require("../../auth/schemas/user.schema");
const employeeHelper = require("../helpers/employee.helper");
const appointmentHelper = require("../helpers/appointment.helper");
const appointmentService = require("../services/appointment.service");

module.exports.getSchedulesOfEmployeeByGivenDate = async (employeeId, dateStr) => {
    try {
        let givenDate = dateStr;
        if (!givenDate) throw apiUtil.ErrorWithStatusCode("La date doit être fournies", 500);
        givenDate = new Date(givenDate);

        const employee = await Employee.findById(employeeId, '-workSchedule.schedule._id');
        if (!employee) throw apiUtil.ErrorWithStatusCode("Cet employee n'existe pas", 500);

        
        const scheduleOfTheDayIndex = employeeHelper.getScheduleOfTheDayIndex(employee.workSchedule, givenDate);
        if (scheduleOfTheDayIndex < 0) throw new apiUtil.ErrorWithStatusCode("Cet employé ne travaille pas un " + frenchDayName, 500);

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