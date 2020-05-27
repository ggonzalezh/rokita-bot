const moment = require("moment");
const timeFormat = require('hh-mm-ss');

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

exports.formatDate = (date) => {
    let formatDate = moment(date).format('DD/MM/YYYY');
    return formatDate;
}

exports.secondsToMinute = (seconds) => {
    let minutes = timeFormat.fromS(seconds, 'mm:ss')
    return minutes;
}

exports.isNewDay = (value) => {
    let dateNow = moment(new Date(), 'DD/MM/YYYY').format('DD/MM/YYYY');
    let isAfter = moment(value.user.date).isAfter(dateNow);
    if(isAfter){
        return true;
    }else{
        return false;
    }
}

exports.sendErrorConsole = (error) => {
    console.log("----------ERROR----------");
    console.log(error);
    console.log("----------FIN----------")
}