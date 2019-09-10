const moment = require("moment");

exports.formatDateToYear = (date) => {
    let formatDate = moment(date).format('YYYY');
    return formatDate;
}

exports.formatDate = (date) => {
    let formatDate = moment(date).format('DD/MM/YYYY');
    return formatDate;
}
