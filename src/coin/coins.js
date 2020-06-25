const {insertCoins, getCoinsStats} = require('./service/coinsService');
const {sendErrorConsole} = require('../helper/utils');
const {fillArrayWithIcons} = require('../helper/discord');
const {sendMessage, createEmbedMessage, sendEmbedMessage} = require('../discord/message')
const {isNewDay} = require('../helper/utils');
const array = require("../helper/arrays");


exports.coinsSystem = (message, args) => {
    try{

    }catch(err){

    }
}

const getCoins = (message) => {
    try {
        getCoinsStats(message.author.id, message.guild.id).then(user => {
            if (user) {
                let fields = [{
                    name: "Propietario de la cuenta",
                    value: message.author.username
                },
                    {
                        name: "Coins",
                        value: user.coins
                    }];
                sendEmbedMessage(createEmbedMessage("Banco", fields, "https://image.flaticon.com/icons/png/512/275/275806.png"), message);
            } else {
                sendMessage("no tienes coins. Usa el comando `" + "!daily`.", message).then();
            }
        }).catch(err => {
            sendMessage("ocurrió un error al obtener tus coins", message).then();
            sendErrorConsole(err);
        });
    } catch (err) {
        sendMessage("ocurrió un error al obtener tus coins", message).then();
        sendErrorConsole(err);
    }
};
