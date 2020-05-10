const {newUserLeveling, getStatsPlayers, giveExperience} = require('../service/experienceService');
const {sendMessage} = require('../discord/message');
const {sendErrorConsole, isNewDay} = require('../helper/utils');

exports.newUserInGame = (message) => {
    try {
        getStatsPlayers(message.author.id, message.guild.id).then(value => {
            if (value.user.userId === undefined) {
                newUserLeveling(message.author.id, message.guild.id, message.author.username).then(value => {
                    sendMessage('Has sido ingresado', message).then();
                })
            } else {
                if(isNewDay(value.user.lastUpdate)){
                    giveExperience().then(value => {
                        sendMessage('Te dimos level', message).then();
                    }).catch(err => {
                        sendMessage(err, message).then();
                    })
                }else{
                    sendMessage('ya obtuviste tu experiencia diaria').then();
                }
            }
        }).catch(err => {
            sendErrorConsole(err);
            sendMessage('error insertar nuevo usuario', message).then();
        })
    } catch (err) {
        sendMessage('ocurrió un error inesperado en el sistema de niveles', message).then();
        sendErrorConsole(err);
    }
}


