const crypto = require('crypto');

function generatePassword(length) {
  // Define the character set for the password
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';

  let password = '';
  for (let i = 0; i < length; i++) {
    // Generate a random index to select a character from the charset
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }

  return password;
}
function getScheduleOfTheDayIndex(employeeWorkSchedule, appointmentDate) {
    const day = appointmentDate.getDay();
    return employeeWorkSchedule.findIndex((schedule) => schedule.day === day);
}

module.exports.getScheduleOfTheDayIndex = getScheduleOfTheDayIndex;
module.exports.generatePassword = generatePassword;