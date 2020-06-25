const {addUser, getExperienceStats, insertExperience, rangeUp, findAllUserByGuild} = require('./service/experienceService');
const {sendMessage, createEmbedMessage, sendEmbedMessage, createEmbedLeaderboards} = require('../discord/message');
const {sendErrorConsole, isNewDay} = require('../helper/utils');


exports.experienceSystem = (command, message) => {
    switch (command) {
        case "registrar":
            newUser(message);
            break;
        case "stats":
            getExperienceStatsUser(message);
            break;
        case "daily":
            experienceUp(message);
            break;
        default:
            break;
    }
}


const newUser = (message) => {
    getExperienceStats(message.author.id, message.guild.id).then(user => {
        if (!user) {
            addUser(message.author.id, message.guild.id, message.author.username).then(() => {
                sendMessage('has sido ingresado. Usa el comando `-cuenta` para revisar tu cuenta.', message).then();
            }).catch(err => {
                sendMessage('ocurrió un error insertando tus datos en el sistema. Intentalo más tarde.', message).then();
                sendErrorConsole(err);
            })
        } else {
            sendMessage('tu cuenta ya esta registrado en este servidor. Usa el comando `-cuenta` para revisar tu cuenta', message).then();
        }
    }).catch(err => {
        sendMessage('ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.', message).then();
        sendErrorConsole(err);
    })
}

const getExperienceStatsUser = (message) => {
    getExperienceStats(message.author.id, message.guild.id).then(user => {
        if (!user) {
            sendMessage('tu cuenta no se encuentra registrada en este servidor. Usa el comando `-registrar` para ingresar los datos de tu cuenta.', message).then();
        } else {
            let stats = [
                {
                    name: 'Rango',
                    value: user.range
                },
                {
                    name: `Nivel: ${user.level}`,
                    value: createProgressBar(user.experience)
                }
            ]
            sendEmbedMessage(createEmbedMessage(message.author.username, stats, message.author.avatarURL()), message);
        }
    }).catch(err => {
        sendMessage("ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.", message).then();
        sendErrorConsole(err);
    })
}

const experienceUp = (message) => {
    getExperienceStats(message.author.id, message.guild.id).then(user => {
        if (!user) {
            sendMessage('tu cuenta no se encuentra registrada en este servidor. Usa el comando `-registrar` para ingresar los datos de tu cuenta.', message).then();
        } else if (user.experienceToLevelUp <= 1) {
            rangeUp(message.author.id, message.guild.id, user).then(() => {
                sendMessage('has subido de nivel!', message).then()
            }).catch(err => {
                sendMessage('ocurrió un error subiendo de experencia. Intentalo más tarde.').then()
                sendErrorConsole(err);
            });
        } else if (isNewDay(user.lastUpdate)) {
            insertExperience(message.author.id, message.guild.id, user).then(() => {
                sendMessage('has obtenido `1` punto de experiencia. Revisa tus stats con el comando `-cuenta`', message).then();
            }).catch(err => {
                sendMessage("ocurrió un error subiendo de experencia. Intentalo más tarde.", message).then()
                sendErrorConsole(err);
            })
        } else {
            sendMessage('ya obtuviste tu experiencia hoy, intentalo mañana.', message).then();
        }
    }).catch(err => {
        sendMessage("ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.", message).then();
        sendErrorConsole(err);
    })
}