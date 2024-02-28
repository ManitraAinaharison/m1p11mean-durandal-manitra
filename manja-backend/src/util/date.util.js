function datesAreEqualWithoutTime(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function toLongFrenchDate(date) {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${dayOfMonth} ${month} ${year}`;
}

function humanizeHour(date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour}h${minute < 10 ? '0' : ''}${minute}`;
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

module.exports.datesAreEqualWithoutTime = datesAreEqualWithoutTime
module.exports.toLongFrenchDate = toLongFrenchDate
module.exports.humanizeHour = humanizeHour
module.exports.isValidDate = isValidDate