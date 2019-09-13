const { Client } = require("discord.js");
const { connectMongoDb } = require('./src/service/database/connect');
const { insertCoins, getCoins, winCoins, loseCoins } = require('./src/service/database/coins');
const { experienceSystem } = require('./src/service/database/experience');
const { createEmbedMessage, createHelp, fillArrayWithIcons } = require('./src/helper/discord');
const { validateUrl, getSongInfo, getThumbnail } = require('./src/service/music/helper/utils');
const { secondsToMinute, mereceCoins } = require('./src/helper/utils');
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
    getCoins(member.id, member.guild.id).then(value => {
        if (undefined == value.user.date) {
            insertCoins(member.id, member.guild.id, member.displayName).then().catch(err => {
                member.guild.channels.find("name", "general").send(`Ocurrió un error en el regalo de monedas a ${member.toString}`);
                console.log(err);
            });
        }
    }).catch(err => {
        message.channel.send(`${member.toString()} ocurrió un error al obtener tus coins`);
        console.log(err.error);
    });
});


client.on("message", (message) => {
    var embed;
    var fields;
    if (message.author.equals(client.user)) {
        return;
    }
    experienceSystem(message.author.id, message.guild.id, message.author.username);
    if (!message.content.startsWith(prefix)) {
        return;
    }
    var args = message.content.substring(prefix.length).split(" ");
    switch (args[0].toLowerCase()) {
        case "play":
            if (!args[1]) {
                message.channel.send(`${message.author.toString()} falto el link de la canción. Más Vivaldi, menos Pavarotti.`);
                return;
            }

            if (!message.member.voiceChannel) {
                message.channel.send(message.author.toString() + " Tienes que estar en el canal para usar el comando `!play`");
                return;
            }

            var isValidLink = validateUrl(args[1]);
            if (isValidLink) {
                if (!songs[message.guild.id]) {
                    songs[message.guild.id] = {
                        queue: []
                    }
                }
                getSongInfo(args[1]).then(value => {
                    let songRequest = {
                        userName: message.author.username,
                        userAvatar: message.author.avatarURL,
                        songTitle: value.info.title,
                        songUrl: args[1],
                        songLength: value.info.duration
                    }
                    let listSongs = songs[message.guild.id];
                    listSongs.queue.push(songRequest);
                    message.channel.send(message.author.toString() + ", La canción `" + value.info.title + "` fue agregada a la playlist.")
                    if (!message.guild.voiceConnection) {
                        message.member.voiceChannel.join().then((connection) => {
                            playList(connection, message);
                        });
                    }
                });
            } else {
                fields = [{
                    name: message.author.username,
                    value: "La url debe ser de Youtube"
                }]
                embed = createEmbedMessage(undefined, fields, 'https://cdn.icon-icons.com/icons2/1584/PNG/512/3721679-youtube_108064.png', undefined);
                message.channel.send(embed);
            }
            break;
        case "skip":
            if (!message.member.voiceChannel) {
                message.channel.send(message.author.toString() + " Tienes que estar en el canal para usar el comando `!skip`");
                return;
            }
            let listSongs = songs[message.guild.id];
            if (listSongs.dispatcher) {
                listSongs.dispatcher.end();
            }
            break;
        case "stop":
            if (!message.member.voiceChannel) {
                message.channel.send(message.author.toString() + " Tienes que estar en el canal para usar el comando `!stop`");
                return;
            }
            if (message.guild.voiceConnection) {
                let stopPlaylist = songs[message.guild.id];
                stopPlaylist.queue.length = 0;
                message.guild.voiceConnection.disconnect();
            }
            break;
        case "playlist":
            if (songs[message.guild.id]) {
                let listSong = songs[message.guild.id]
                let songRequest = listSong.queue
                if (songRequest.length > 0) {
                    let playlistArray = []
                    let index = 0;
                    for (const song of songRequest) {
                        index = index + 1;
                        fields = {
                            name: `${index}. Pedida por ${song.userName}`,
                            value: `[${song.songTitle}](${song.songUrl})`
                        }
                        playlistArray.push(fields);
                    }
                    embed = createEmbedMessage("Playlist", playlistArray, undefined, undefined);
                    message.channel.send(embed);
                } else {
                    message.channel.send(`${message.author.toString()} no hay canciones en espera`);
                }
            } else {
                message.channel.send(`${message.author.toString()} la playlist está vacía`);
            }
            break;
        case "coins":
            getCoins(message.author.id, message.guild.id).then(value => {
                if (value.user.coins !== undefined) {
                    fields = [{
                        name: "Propietario de la cuenta",
                        value: message.author.username
                    },
                    {
                        name: "Coins",
                        value: value.user.coins
                    }]
                    embed = createEmbedMessage("Banco del Distrito Federal de Puno", fields, "https://image.flaticon.com/icons/png/512/275/275806.png");
                    message.channel.send(embed);
                }else{
                    message.channel.send(`${message.author.toString()} no tienes coins. Usa el comando` + " `!daily`");
                }
            }).catch(err => {
                message.channel.send(`${message.author.toString()} ocurrió un error al obtener tus coins`);
                console.log(err.error);
            });
            break;
        case "daily":
            getCoins(message.author.id, message.guild.id).then(value => {
                if (undefined == value.user.date) {
                    insertCoins(message.author.id, message.guild.id, message.author.username).then(value => {
                        message.channel.send(`${message.author.toString()} se han añadido $1000 a tu cuenta. Total: $${value.user.coins}`);
                    }).catch(err => console.log(err));
                } else {
                    if (!value.user.newUser) {
                        if (mereceCoins(value)) {
                            insertCoins(message.author.id, message.guild.id, message.author.username).then(value => {
                                if (!value.user.newUser) {
                                    message.channel.send(`${message.author.toString()} se han añadido $1000 a tu cuenta. Total: $${value.user.coins}`);
                                }
                            }).catch(err => { console.log(err); });
                        } else {
                            message.channel.send(`${message.author.toString()} ya canjeaste tus monedas diarias, inténtalo mañana.`)
                        }
                    }
                }
            })
            break;
        case "bet":
            if (!args[1]) {
                message.channel.send(`${message.author.toString()} falta el monto que quieres apostar`);
                return;
            }
            if (args[1] < 10) {
                message.channel.send(`${message.author.toString()} el monto mínimo de la apuesta es de $10`);
                return;
            }
            getCoins(message.author.id, message.guild.id).then(value => {
                if (value.user.coins !== undefined) {
                    if (value.user.coins >= args[1]) {
                        var icons = fillArrayWithIcons(array.iconos);
                        message.channel.send(`${icons[0].icon} ${icons[1].icon} ${icons[2].icon}`);
                        var isArrayEquals = icons.every((val, i, arr) => val === arr[0]);
                        if (isArrayEquals) {
                            let coinsWins = (value.user.coins - args[1]) + (args[1] * 2);
                            winCoins(message.author.id, message.guild.id, coinsWins).then(value => {
                                message.channel.send(`Felicitaciones ${message.author.toString()}, has ganado ${(args[1] * 2)} coins.Tu balance actual es de: $${value.user.coins}.`);
                            }).catch(err => {
                                console.log(err);
                            })
                        } else {
                            let coinsLoses = value.user.coins - args[1];
                            loseCoins(message.author.id, message.guild.id, coinsLoses).then().catch(err => console.log(err));
                        }
                    } else {
                        message.channel.send(`${message.author.toString()} no tienes las coins suficientes para apostar $${args[1]}.`);
                    }
                } else {
                    message.channel.send(`${message.author.toString()} no tienes coins. Usa el comando` + " `!daily`");
                }
            }).catch(err => {

            });
            break;
        case "ayuda":
            fields = createHelp();
            embed = createEmbedMessage(undefined, fields, undefined, undefined);
            message.channel.send(`${message.author.toString()} **Inbox perrito !** :incoming_envelope:`)
            message.author.send(embed);
            break;
        default:
            message.channel.send(`${message.author.toString()} no existe ese comando`)
    }
});

var playList = async (connection, message) => {
    let playlist = songs[message.guild.id];
    let requestSong = playlist.queue[0];
    let thumbnail = getThumbnail(requestSong.songUrl);
    playlist.dispatcher = connection.playOpusStream(await dtdl(requestSong.songUrl));
    if (playlist.queue.length > 0) {
        let fields = [{
            name: "Titulo de la canción",
            value: `[${requestSong.songTitle}](${requestSong.songUrl})`

        },
        {
            name: "Duración",
            value: secondsToMinute(parseInt(requestSong.songLength))
        }]
        let footer = {
            text: `Canción pedida por ${requestSong.userName}`,
            icon: requestSong.userAvatar
        }
        let embed = createEmbedMessage("Escuchando Ahora", fields, thumbnail, footer);
        message.channel.send(embed);
    }
    playlist.queue.shift();
    playlist.dispatcher.on("end", () => {
        if (playlist.queue[0]) {
            playList(connection, message);
        } else {
            connection.disconnect();
        }
    });
};
