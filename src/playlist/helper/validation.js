const { sendMessage } = require('../../discord/message');
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
            sendMessage("falto el link o el nombre de la canción", message).then();
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
        if (!message.member.voice.channel) {
            sendMessage("tienes que estar en el canal para usar el comando.", message).then();
            return false;
        }else{
            return true;
        }
    } catch (err) {
        sendErrorConsole(err);
    }
}