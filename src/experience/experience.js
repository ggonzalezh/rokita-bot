const {addUser, getStats, giveExperience, rangeUp, findAllUserByGuild} = require('./service/experienceService');
const {sendMessage, createEmbedMessage, sendEmbedMessage, createEmbedLeaderboards} = require('../discord/message');
const {sendErrorConsole, isNewDay} = require('../helper/utils');


exports.experienceSystem = (command, message) => {
    switch (command) {
        case "registrar":
            newUser(message);
            break;
        case "stats":
            getStatsUser(message);
            break;
        case "diaria":
            experienceUp(message);
            break;
        case 'tabla':
            leaderboards(message);
            break;
        default:
            break;
    }
}


const newUser = (message) => {
    getStats(message.author.id, message.guild.id).then(response => {
        if (!response) {
            addUser(message.author.id, message.guild.id, message.author.username).then(() => {
                sendMessage('has sido ingresado. Usa el comando `-stats` para revisar tu cuenta.', message).then();
            }).catch(err => {
                sendMessage('ocurrió un error insertando tus datos en el sistema. Intentalo más tarde.', message).then();
                sendErrorConsole(err);
            })
        } else {
            sendMessage('tu cuenta ya esta registrado en este servidor. Usa el comando `-stats` para revisar tu cuenta', message).then();
        }
    }).catch(err => {
        sendMessage('ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.', message).then();
        sendErrorConsole(err);
    })
}

const getStatsUser = (message) => {
    getStats(message.author.id, message.guild.id).then(response => {
        if (!response) {
            sendMessage('tu cuenta no se encuentra registrada en este servidor. Usa el comando `-register` para ingresar los datos de tu cuenta.', message).then();
        } else {
            let stats = [
                {
                    name: 'Rango',
                    value: response._doc.range
                },
                {
                    name: `Nivel: ${response._doc.level}`,
                    value: createProgressBar(response._doc.experience)
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
    getStats(message.author.id, message.guild.id).then(user => {
        if (!user) {
            sendMessage('tu cuenta no se encuentra registrada en este servidor. Usa el comando `-register` para ingresar los datos de tu cuenta.', message).then();
        } else if (user._doc.experienceToLevelUp <= 1) {
            rangeUp(message.author.id, message.guild.id, user._doc).then(() => {
                sendMessage('has subido de nivel!', message).then()
            }).catch(err => {
                sendMessage('ocurrió un error subiendo de experencia. Intentalo más tarde.').then()
                sendErrorConsole(err);
            });
        } else if (isNewDay(user._doc.lastUpdate)) {
            giveExperience(message.author.id, message.guild.id, user._doc).then(() => {
                sendMessage('has obtenido `1` punto de experiencia. Revisa tus stats con el comando `-stats`', message).then();
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

const leaderboards = (message) => {
    try {
        findAllUserByGuild(message.guild.id).then(value => {
            sendEmbedMessage(createEmbedLeaderboards(orderArrayLeaderboards(value), message), message);
        }).catch(err => {
            console.log(err);
        })
    } catch (err) {
        sendMessage("ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.", message).then();
        sendErrorConsole(err);
    }
};

const orderArrayLeaderboards = (value) => {
    try {
        let users = [];
        let leaderboard = []
        for (let data of value) {
            users.push(data._doc);
        }
        users.sort((a, b) => {
            return parseFloat(b.level) - parseFloat(a.level)
        })
        for (let userData of users) {
            if (leaderboard.length <= 10) {
                leaderboard.push(userData);
            } else {
                break;
            }
        }
        return leaderboard;
    } catch (err) {

    }
}
const createProgressBar = (experience) => {
    let progressBar = '';
    if (experience < 1) {
        for (let i = 0; i < 10; i++) {
            progressBar = progressBar + '⬜';
        }
    } else {
        let experienceLess = 10 - experience;
        for (let i = 0; i < experience; i++) {
            progressBar = progressBar + '🟩';
        }
        for (let x = 0; x < experienceLess; x++) {
            progressBar = progressBar + '⬜';
        }
    }
    return progressBar;
}