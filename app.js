const { Client } = require("discord.js");
const { logginCredentials } = require("./src/controller/discord/ready")
const { sayHello, sendMessageToChannel } = require("./src/controller/discord/memberAdd");
const { getCoins, dailyCoins, betCoins } = require('./src/controller/coin/coins');
const { betValidation } = require('./src/controller/coin/helper/validation');
const { experienceSystem } = require('./src/service/database/experienceService');
const { createEmbedMessage, createHelp, sendMessage, sendEmbedMessage } = require('./src/helper/discord');
const { playSong, skipSong, stopPlaylist, shufflePlaylist } = require('./src/controller/playlist/playlist');
const { validationPlay, userInChannel } = require('./src/controller/playlist/helper/validation');
const { sendErrorConsole } = require('./src/helper/utils');
const config = require('config.json');

const prefix = config.discord.prefix;
const client = new Client();

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
    logginCredentials(client);
});

client.on("guildMemberAdd", (member) => {
    sayHello(member);
    getCoins(member.id, member.guild.id).then(value => {
        if (undefined == value.user.date) {
            insertCoins(member.id, member.guild.id, member.displayName).then().catch(err => {
                sendMessageToChannel(member, "general", " ocurrió un error en el regalo de monedas");
                console.log(err);
            });
        }
    }).catch(err => {
        sendMessageToChannel(member, "general", "Ocurrió un error al obtener tus coins")
        console.log(err);
    });
});


client.on("message", (message) => {
    let embed;
    let fields;
    try {
        if (message.author.equals(client.user)) {
            return;
        }
        experienceSystem(message.author.id, message.guild.id, message.author.username);
        if (!message.content.startsWith(prefix)) {
            return;
        }
        let args = message.content.substring(prefix.length).split(" ");
        switch (args[0].toLowerCase()) {
            case "play":
                if (validationPlay(message, args)) {
                    playSong(message, args);
                }
                break;
            case "skip":
                if (userInChannel(message)) {
                    skipSong(message);
                }
                break;
            case "stop":
                if (userInChannel(message)) {
                    stopPlaylist(message);
                }
                break;
            case "shuffle":
                if (userInChannel(message)) {
                    shufflePlaylist(message);
                }
                break;
            case "playlist":
                sendMessage("comando en construcción", message);
                break;
            case "coins":
                getCoins(message);
                break;
            case "daily":
                dailyCoins(message);
                break;
            case "bet":
                if (betValidation(message, args)) {
                    betCoins(message, args);
                }
                break;
            case "leaderboards":
                sendMessage("comando en construcción", message);
                break;
            case "ayuda":
                fields = createHelp();
                sendMessage("**Inbox perrito !** :incoming_envelope:", message);
                sendEmbedMessage(createEmbedMessage(undefined, fields, undefined, undefined), message);
                break;
            default:
                sendMessage('no existe ese comando', message);
        }
    } catch (err) {
        sendMessage('ocurrió un error', message);
        sendErrorConsole(err);
    }
});