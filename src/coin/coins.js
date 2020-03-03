const { insertCoins, getCoins, winCoins, loseCoins, findAllCoins } = require('../service/coinsService');
const { sendErrorConsole } = require('../helper/utils');
const { fillArrayWithIcons } = require('../helper/discord');
const { sendMessage, createEmbedMessage, sendEmbedMessage } = require('../discord/message')
const { isNewDay } = require('../helper/utils');
const array = require("../helper/arrays");


exports.getCoins = (message) => {
    try {
        getCoins(message.author.id, message.guild.id).then(value => {
            if (value.user.coins !== undefined) {
                fields = [{
                    name: "Propietario de la cuenta",
                    value: message.author.username
                },
                {
                    name: "Coins",
                    value: value.user.coins
                }];
                sendEmbedMessage(createEmbedMessage("Banco del Distrito Federal de Puno", fields, "https://image.flaticon.com/icons/png/512/275/275806.png"), message);
            } else {
                sendMessage("no tienes coins. Usa el comando` + " `!daily`, message);
            }
        }).catch(err => {
            sendMessage("ocurrió un error al obtener tus coins", message);
            sendErrorConsole(err);
        });
    } catch (err) {
        sendMessage("ocurrió un error al obtener tus coins", message);
        sendErrorConsole(err);
    }
};

exports.dailyCoins = (message) => {
    try {
        getCoins(message.author.id, message.guild.id).then(value => {
            if (undefined == value.user.date) {
                insertCoins(message.author.id, message.guild.id, message.author.username).then(value => {
                    sendMessage('se han añadido $1000 a tu cuenta. Total: $' + value.user.coins, message);
                }).catch(err => {
                    sendMessage('ocurrió un error añadiendo coins a tu cuenta', message);
                    sendErrorConsole(err);
                });
            } else {
                if (!value.user.newUser) {
                    if (isNewDay(value)) {
                        insertCoins(message.author.id, message.guild.id, message.author.username).then(value => {
                            if (!value.user.newUser) {
                                sendMessage('se han añadido $1000 a tu cuenta. Total: $' + value.user.coins, message);
                            }
                        }).catch(err => {
                            sendMessage('ocurrió un error añadiendo coins a tu cuenta', message);
                            sendErrorConsole(err);
                        });
                    } else {
                        sendMessage('ya canjeaste tus monedas diarias, inténtalo mañana', message);
                    }
                }
            }
        }).catch(err => {
            sendMessage("ocurrió un error al obtener tus coins", message);
            sendErrorConsole(err);
        });
    } catch (err) {

    }
};

exports.betCoins = (message, args) => {
    try {
        getCoins(message.author.id, message.guild.id).then(value => {
            if (value.user.coins !== undefined) {
                if (value.user.coins >= args[1]) {
                    let icons = fillArrayWithIcons(array.iconos);
                    message.channel.send(`${icons[0].icon} ${icons[1].icon} ${icons[2].icon}`);
                    let isArrayEquals = icons.every((val, i, arr) => val === arr[0]);
                    if (isArrayEquals) {
                        let coinsWins = (value.user.coins - args[1]) + (args[1] * 2);
                        winCoins(message.author.id, message.guild.id, coinsWins).then(value => {
                            sendMessage("Felicitaciones has ganado " + (args[1] * 2) + " coins.Tu balance actual es de: $" + value.user.coins + ".", message);
                        }).catch(err => {
                            sendMessage('ocurrió un error añadiendo coins a tu cuenta', message);
                            sendErrorConsole(err);
                        })
                    } else {
                        let coinsLoses = value.user.coins - args[1];
                        loseCoins(message.author.id, message.guild.id, coinsLoses).then().catch(err => {
                            sendErrorConsole(err);
                        });
                    }
                } else {
                    sendMessage("no tienes las coins suficientes para apostar $" + args[1] + ".", message);
                }
            } else {
                sendMessage("no tienes coins. Usa el comando" + " `!daily`", message);
            }
        }).catch(err => {
            sendMessage("ocurrió un error usando el comando" + " `!bet`", message);
            sendErrorConsole(err);
        });
    } catch (err) {
        sendMessage("ocurrió un error usando el comando" + " `!bet`", message);
        sendErrorConsole(err);
    }
};

exports.findCoins = (message) => {
    findAllCoins(message.guild.id).then(value => {

    }).catch(err => {
        console.log(err);
    });
};