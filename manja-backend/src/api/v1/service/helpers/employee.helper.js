
function getScheduleOfTheDayIndex(employeeWorkSchedule, appointmentDate) {
    const day = appointmentDate.getDay();
    return employeeWorkSchedule.findIndex((schedule) => schedule.day === day);
}

module.exports.getScheduleOfTheDayIndex = getScheduleOfTheDayIndex;