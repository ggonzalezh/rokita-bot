const { Client } = require("discord.js");
const { connectMongoDb } = require('./src/service/database/connect');
const { chiboloCoins, getChiboloCoins } = require('./src/service/database/coins');
const { experienceSystem } = require('./src/service/database/experience');
const { createEmbedMessage, createHelp } = require('./src/helper/discord');
const { validateUrl } = require('./src/service/music/helper/utils');
const { getSongInfo } = require('./src/service/music/helper/utils')
const dtdl = require('ytdl-core-discord');
const config = require('./config.json')
const array = require("./src/helper/arrays");

const prefix = config.discord.prefix;
const client = new Client();
var songs = {};

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
    connectMongoDb(process.env.MONGOLAB_URI);
    console.log("RokitaBOT ON!");
    client.user.setActivity("!Ayuda");
});

client.on("guildMemberAdd", (member) => {
    member.guild.channels.find("name", "general").send(member.toString() + " Bienvenido, " + array.bienvenido[Math.floor(Math.random() * array.bienvenido.length)]);
});


client.on("message", (message) => {
    var embed;
    var fields;
    if (message.author.equals(client.user)) {
        return;
    }
    chiboloCoins(message.author.id, message.guild.id, message.author.username);
    experienceSystem(message.author.id, message.guild.id, message.author.username);
    if (!message.content.startsWith(prefix)) {
        return;
    }
    var args = message.content.substring(prefix.length).split(" ");
    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
                message.channel.send(message.author.toString() + " Falto el link de la canción. Más Vivaldi, menos Pavarotti.");
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.send(message.author.toString() + " Tienes que estar en el canal para usar el comando !Play.");
                return;
            }

            var isValidLink = validateUrl(args[1]);
            if (isValidLink) {
                if (!songs[message.guild.id]) {
                    songs[message.guild.id] = {
                        queue: []
                    }
                }
                let isEarly = "isEarly";
                getSongInfo(args[1], message.author.username, message.author.avatarURL, isEarly, message).then(value => message.channel.send(value));
                let listSongs = songs[message.guild.id];

                listSongs.queue.push(args[1]);
                if (!message.guild.voiceConnection) {
                    message.member.voiceChannel.join().then((connection) => {
                        playList(connection, message)
                    });
                }
            } else {
                embed = createEmbedMessage(["ERROR", "La url solo puede ser de youtube"]);
                message.channel.send(embed);
            }
            break;
        case "skip":
            let listSongs = songs[message.guild.id];
            if (listSongs.dispatcher) {
                listSongs.dispatcher.end();
            }
            break;
        case "stop":
            if (message.guild.voiceConnection) {
                message.guild.voiceConnection.disconnect();
            }
            break;
        /*case "chibolocoins":
            getChiboloCoins(message.author.id, message.guild.id).then(value => {
                fields = [{
                    name: "Propietario de la cuenta",
                    value: message.author.username
                },
                {
                    name: "ChiboloCoins",
                    value: value.user.coins
                }]
                embed = createEmbedMessage("Banco del Distrito Federal de Puno", fields, "https://image.flaticon.com/icons/png/512/275/275806.png");
                message.channel.send(embed);
            });
            break;
        case "cuenta":
            let createdDate = formatDate(message.author.createdAt);
            break;
        case "profecia":
            break;
        case "piel":
            message.channel.send(message.author.toString() + " Tu color de piel es " + array.color[Math.floor(Math.random() * array.color.length)]);
            break;
        case "tmr":
            break;
        case "10dif":
            break;*/
        case "ayuda":
            fields = createHelp();
            embed = createEmbedMessage(undefined, fields, undefined, undefined);
            message.channel.send(message.author.toString() + " **Inbox perrito !** :incoming_envelope:")
            message.author.send(embed);
            break;
        default:
            embed.setImage("https://pa1.narvii.com/6565/59fb4390472f0373a936595a2b1bd36a4e171520_hq.gif")
                .addField(message.author.username, "No existe ese comando, " + array.bienvenido[Math.floor(Math.random() * array.bienvenido.length)])
                .setColor(0x860202)
            message.channel.send(embed);
    }
});

var playList = async (connection, message) => {
    let playlist = songs[message.guild.id];
    playlist.dispatcher = connection.playOpusStream(await dtdl(playlist.queue[0]));
    playlist.queue.shift();
    playlist.dispatcher.on("end", () => {
        if (playlist.queue[0]) {
            playList(connection, message);
        } else {
            connection.disconnect();
        }
    });
};