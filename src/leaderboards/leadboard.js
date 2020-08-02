const {getExperienceStats, insertExperience, rangeUp, insertUserStats, findAllUserStatsByServer} = require('../experience/service/experienceService');
const {getCoinsStats, insertCoins, insertUserCoins} = require('../coin/service/coinsService');
const {sendMessage, sendEmbedMessage, createEmbedLeaderboards, createEmbedMessage} = require('../discord/message');
const {sendErrorConsole, isNewDay} = require('../helper/utils');

exports.leadboardSystem = (command, message, args) => {
    switch (command) {
        case 'recompensa':
            dailyMission(message);
            break;
        case 'registrar':
            registerUser(message);
            break;
        case 'cuenta':
            getStatsUser(message);
            break;
        case 'tabla':
            leaderboards(message);
            break;
        default:
            break;
    }
}

const registerUser = (message) => {
    Promise.all([getExperienceStats(message.author.id, message.guild.id), getCoinsStats(message.author.id, message.guild.id)]).then(([userExperience, userCoins]) => {
        if (!userExperience && !userCoins) {
            Promise.all([insertUserStats(message.author.id, message.guild.id, message.author.username), insertUserCoins(message.author.id, message.guild.id, message.author.username)])
                .then(() => {
                    sendMessage(`has sido ingresado exitosamente en el servidor \`${message.guild.name}\`. Usa el comando \`-cuenta\` para revisar tu cuenta.`, message).then();
                }).catch((err) => {
                sendMessage("ocurrió un error registrando tu cuenta en el \`Sistema de Experiencia\` y en el \`Sistema de Economía\`. Intentalo más tarde.", message).then();
                sendErrorConsole(err);
            });
        } else if (!userExperience) {
            insertUserStats(message.author.id, message.guild.id, message.author.username).then(() => {
                sendMessage(`has sido ingresado exitosamente en el \`Sistema de Experiencia\` del servidor \`${message.guild.name}\`. Usa el comando \`-cuenta\` para revisar tu cuenta.`, message).then();
            }).catch((err) => {
                sendMessage("ocurrió un error registrando tu cuenta en el \`Sistema de Experiencia\`. Intentalo más tarde.", message).then();
                sendErrorConsole(err);
            });
        } else if (!userCoins) {
            insertUserCoins(message.author.id, message.guild.id, message.author.username).then(() => {
                sendMessage(`has sido ingresado exitosamente en el \`Sistema de Economía\` del servidor \`${message.guild.name}\`. Usa el comando \`-cuenta\` para revisar tu cuenta.`, message).then();
            }).catch((err) => {
                sendMessage("ocurrió un error registrando tu cuenta en el \`Sistema de Economía\`. Intentalo más tarde.", message).then();
                sendErrorConsole(err);
            });
        }else{
            sendMessage(`ya te encuentras registrado en el servidor \`${message.guild.name}\`. Usa el comando \`-cuenta\` para revisar tu cuenta.`, message).then();
        }
    }).catch((err) => {
        sendMessage(`ocurrió un error registrando tu cuenta en el servidor \`${message.guild.name}\`. Intentalo más tarde.`, message).then();
        sendErrorConsole(err);
    })
}

const dailyMission = (message) => {
    Promise.all([getExperienceStats(message.author.id, message.guild.id), getCoinsStats(message.author.id, message.guild.id)]).then(([userExperience, userCoins]) => {
        if (!userExperience && !userCoins) {
            sendMessage(`tu cuenta no se encuentra registrada en el servidor ${message.guild.name}. Usa el comando \`-registrar\` para ingresar los datos de tu cuenta.`, message).then();
        } else if (isNewDay(userExperience.lastUpdate) && isNewDay(userCoins.lastUpdate) && userExperience.experienceToLevelUp <= 1) {
            Promise.all([rangeUp(message.author.id, message.guild.id, userExperience), insertCoins(message.author.id, message.guild.id, userCoins)]).then(() => {
                sendMessage(`increíble, has subido a nivel \`${userExperience.level + 1}\`!. Tambien se han añadido \`$1000\` monedas a tu cuenta.`, message).then();
            }).catch((err) => {
                sendMessage('ocurrió un error canjeando la recompensa diaria. Intentalo más tarde.').then()
                sendErrorConsole(err);
            });
        } else if (isNewDay(userExperience.lastUpdate) && isNewDay(userCoins.lastUpdate)) {
            Promise.all([insertExperience(message.author.id, message.guild.id, userExperience), insertCoins(message.author.id, message.guild.id, userCoins)]).then(() => {
                sendMessage(`has obtenido \`1\` de experiencia y tambien se han añadido \`$1000\` monedas a tu cuenta.`, message).then();
            }).catch((err) => {
                sendMessage('ocurrió un error canjeando la recompensa diaria. Intentalo más tarde.').then()
                sendErrorConsole(err);
            });
        } else {
            sendMessage('ya obtuviste tu recompensa diaria, intentalo mañana.', message).then();
        }
    }).catch((err) => {
        sendMessage('ocurrió un error canjeando la recompensa diaria. Intentalo más tarde.').then()
        sendErrorConsole(err);
    });
}

const getStatsUser = (message) => {
    Promise.all([getExperienceStats(message.author.id, message.guild.id), getCoinsStats(message.author.id, message.guild.id)]).then(([userExperience, userCoins]) => {
        if (!userExperience && !userCoins) {
            sendMessage(`tu cuenta no se encuentra registrada en el servidor \`${message.guild.name}\`. Usa el comando \`-registrar\` para ingresar los datos de tu cuenta.`, message).then();
        }else if(!userExperience) {
            sendMessage(`tu cuenta no se encuentra registrada en el \`Sistema de Experiencia\` del servidor \`${message.guild.name}\`. Usa el comando \`-registrar\` para ingresar los datos de tu cuenta.`, message).then();
        }else if(!userCoins){
            sendMessage(`tu cuenta no se encuentra registrada en el \`Sistema de Economía\` del servidor \`${message.guild.name}\`. Usa el comando \`-registrar\` para ingresar los datos de tu cuenta.`, message).then();
        } else {
            let stats = [
                {
                    name: 'Servidor',
                    value: `**${message.guild.name}**`,
                    inline: true
                },
                {
                    name: 'Rango',
                    value: `**${userExperience.range}**`,
                    inline: true
                },
                {
                    name: 'Monedas',
                    value: `**${userCoins.coins}**`,
                    inline: true
                },
                {
                    name: `Nivel`,
                    value: `**${userExperience.level}**`,
                    inline: true
                },
                {
                    name: `EXP. Total`,
                    value: `**${userExperience.totalExperience}**`,
                    inline: true
                },
                {
                    name: `Items`,
                    value: `**Pronto**`,
                    inline: true
                },
                {
                    name: `Barra EXP.`,
                    value: createProgressBar(userExperience.experience),
                    inline: true
                },
                {
                    name: `EXP. Actual`,
                    value: `**${userExperience.experience}/10**`,
                    inline: true
                },
            ]
            sendEmbedMessage(createEmbedMessage(`${message.author.username}`, stats, message.author.avatarURL()), message);
        }
    }).catch((err) => {
        sendMessage('ocurrió un error obteniendo tus stats en el sistema. Intentalo más tarde.', message).then();
        sendErrorConsole(err);
    })
}

const leaderboards = (message) => {
    try {
        findAllUserStatsByServer(message.guild.id).then(value => {
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