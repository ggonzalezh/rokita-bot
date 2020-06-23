const {addUser, getStats, giveExperience} = require('./service/experienceService');
const {sendMessage, createEmbedMessage, sendEmbedMessage} = require('../discord/message');
const {sendErrorConsole, isNewDay} = require('../helper/utils');


exports.experienceSystem = (message) => {

}


exports.newUser = (message) => {
    addUser(message.author.id, message.guild.id, message.author.username).then(user => {
        sendMessage("has sido ingresado. Utiliza el comando `-stats` para revisar tu progreso.", message).then();
    }).catch(err => {
        sendMessage("ocurrió un error insertando tus datos en el sistema. Intentalo más tarde.", message);
        sendErrorConsole(err);
    })
}

exports.getStatsUser = (message) => {
    getStats(message.author.id, message.guild.id).then(user => {
        if (user.info.userId === undefined) {
            sendMessage("no hay registro de tu cuenta. Usa el comando `-daily`", message).then();
        } else {
            let statsEmbed = [
                {
                    name: 'Rango',
                    value: user.info.stats.range,
                    inline: true
                },
                {
                    name: 'Nivel',
                    value: user.info.stats.level,
                    inline: true,
                },
                {
                    name: 'Experiencia',
                    value: user.info.stats.experience,
                    inline: true
                },
                {
                    name: 'EXP Proximo Nivel',
                    value: user.info.stats.experienceToLevelUp,
                    inline: true
                },
            ]
            sendEmbedMessage(createEmbedMessage(message.author.username, statsEmbed, message.author.avatarURL()), message);
        }
    }).catch(err => {
        sendMessage("ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.", message);
        sendErrorConsole(err);
    })
}

exports.experienceUp = (message) => {
    getStats(message.author.id, message.guild.id).then(user => {
        if (user.info.userId === undefined) {
            sendMessage("no hay registro de tu cuenta. Usa el comando `-daily`", message).then();
        } else if (user.info.stats.experienceToLevelUp === 0) {
            //TODO: RANGEUP
            console.log('RANGEUP')
        } else if (isNewDay(user.info.lastUpdate)) {
            giveExperience(message.author.id, message.guild.id, user).then(() => {
                sendMessage('has obtenido `1` punto de experiencia. Revisa tus stats con el comando `-stats`', message);
            }).catch(err => {
                sendMessage("ocurrió un error subiendo de experencia. Intentalo más tarde.", message);
                sendErrorConsole(err);
            })
        } else {
            sendMessage('ya obtuviste tu experiencia hoy, intentalo mañana', message);
        }
    }).catch(err => {
        sendMessage("ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.", message);
        sendErrorConsole(err);
    })
}