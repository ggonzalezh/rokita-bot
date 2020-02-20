const { sendMessage } = require('../../helper/discord');
const { sendErrorConsole } = require('../../helper/utils');

exports.betValidation = (message, args) => {
    try {
        if (emptyArgs(message, args) && montoMinimoBet(message, args)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        sendErrorConsole(err)
    }
};

let emptyArgs = (message, args) => {
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
};

let montoMinimoBet = (message, args) => {
    try {
        if (args[1] < 10) {
            sendMessage("el monto mínimo de la apuesta es de $10", message);
            return false;
        } else {
            return true;
        }
    } catch (err) {
        sendErrorConsole(err);
    }
};