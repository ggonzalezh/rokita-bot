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
    var isNewDay;
    var dateNow = moment(new Date()).format('DD/MM/YYYY')
    var arrayDateNow = dateNow.split('/')
    var arrayDateDB = value.user.date.split('/');
    if(arrayDateNow[2] >= arrayDateDB[2]){
        if(arrayDateNow[1] >= arrayDateDB[1]){
            if (arrayDateNow[0] > arrayDateDB[0]) {
                isNewDay = true;
            } else {
                isNewDay = false;
            }
        }else{
            isNewDay = false;
        }
    }else{
        isNewDay = false;
    }

    return isNewDay;
}

exports.sendErrorConsole = (error) => {
    console.log("----------ERROR----------");
    console.log(error);
    console.log("----------FIN----------")
}
