const moment = require("moment");
const timeFormat = require('hh-mm-ss');

exports.formatDateToYear = (date) => {
    let formatDate = moment(date).format('YYYY');
    return formatDate;
}

exports.formatDate = (date) => {
    let formatDate = moment(date).format('DD/MM/YYYY');
    return formatDate;
}

exports.secondsToMinute = (seconds) => {
    let minutes = timeFormat.fromS(seconds, 'mm:ss')
    return minutes;
}
