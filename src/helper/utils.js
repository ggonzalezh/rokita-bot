const moment = require("moment");

exports.formatDateToYear = (date) => {
    let formatDate = moment(date).format('YYYY');
    return formatDate;
}

exports.formatDateToMonth = (date) => {
    let formatDate = moment(date).format('MM');
    return formatDate;
}

exports.formatDateToDay = (date) => {
    let formatDate = moment(date).format('DD');
    return formatDate;
}

exports.formatDate = (date) => moment(date).format('YYYY-MM-DD');

exports.isNewDay = (dateLastUpdate) => moment(new Date(), 'YYYY-MM-DD').isAfter(dateLastUpdate, 'day');

exports.sendErrorConsole = (error) => {
    console.log("----------ERROR----------");
    console.log(error);
    console.log("----------FIN----------")
}

const format = (date) => moment(date).format('YYYY/MM/YYYY');