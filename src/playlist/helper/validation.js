const { sendMessage } = require('../../helper/discord');
const { sendErrorConsole } = require('../../helper/utils');

exports.validationPlay = (message, args) => {
    try {
        if (messageHasSong(message, args) && userIsInChannel(message)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        sendErrorConsole(err);
    };
};

exports.userInChannel = (message) => {
    try {
        return userIsInChannel(message);
    } catch (err) {
        sendErrorConsole(err);
    }
}

let messageHasSong = (message, args) => {
    try {
        if (!args[1]) {
            sendMessage("falto el link o el nombre de la canción", message);
            return false;
        } else {
            return true;
        }
    } catch (err) {
        sendErrorConsole(err);
    }
}

let userIsInChannel = (message) => {
    try {
        if (!message.member.voiceChannel) {
            sendMessage("tienes que estar en el canal para usar el comando `!play`", message);
            return false;
        }else{
            return true;
        }
    } catch (err) {
        sendErrorConsole(err);
    }
}