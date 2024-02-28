const employeeHelper = require("./employee.helper");

function isInEmployeeWorkingDay(employeeWorkSchedule, appointmentDate) {
    let scheduleOfTheDayIndex = employeeHelper.getScheduleOfTheDayIndex(employeeWorkSchedule, appointmentDate);
    if (scheduleOfTheDayIndex < 0) return false;
    return true;
}

function isInEmployeeSchedule(employeeWorkSchedule, appointmentDate, subServiceDuration) {
    let scheduleOfTheDayIndex = employeeHelper.getScheduleOfTheDayIndex(employeeWorkSchedule, appointmentDate);
    let scheduleOfTheDay = employeeWorkSchedule[scheduleOfTheDayIndex];
    let dateToCheck = new Date(appointmentDate.getTime());
    dateToCheck.setFullYear(1970);
    dateToCheck.setMonth(0);
    dateToCheck.setDate(1);

    const dateToCheckPlusDuration = new Date(dateToCheck.getTime() + (subServiceDuration * 1000));
    
    for (let i = 0; i < scheduleOfTheDay.schedule.length; i++) {
        const workSchedule = scheduleOfTheDay.schedule[i];
        if((workSchedule.start <= dateToCheck && dateToCheck <= workSchedule.end) && (workSchedule.start <= dateToCheckPlusDuration && dateToCheckPlusDuration <= workSchedule.end))
            return true;
    }
    return false;
}

function notOverlapAnotherAppointment(appointmentsForGivenDate, appointmentDate, subServiceDuration) {
    const appointmentDatePlusDuration = new Date(appointmentDate.getTime() + (subServiceDuration * 1000));
    for (let i = 0; i < appointmentsForGivenDate.length; i++) {
        const schedule = appointmentsForGivenDate[i];
        const scheduleStart = schedule.appointmentDate;
        const scheduleEnd = (scheduleStart.getTime() + (schedule.duration * 1000));

        if((appointmentDate <= scheduleStart && scheduleStart <= appointmentDatePlusDuration) || (appointmentDate <= scheduleEnd && scheduleEnd <= appointmentDatePlusDuration))
            return false;
    }
    return true;
}

function getDateIntervalOfAppoiment(appointment) {
    const appointmentDate = appointment.appointmentDate;
    const appointmentDatePlusDuration = new Date(appointmentDate.getTime() + (appointment.duration * 1000));
    return {
        start: appointmentDate,
        end: appointmentDatePlusDuration
    };
}

module.exports.isInEmployeeWorkingDay = isInEmployeeWorkingDay;
module.exports.isInEmployeeSchedule = isInEmployeeSchedule;
module.exports.notOverlapAnotherAppointment = notOverlapAnotherAppointment;
module.exports.getDateIntervalOfAppoiment = getDateIntervalOfAppoiment;
