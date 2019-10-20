const { Client } = require("discord.js");
const { logginCredentials } = require("./src/controller/discord/ready")
const { sayHello, sendMessageToChannel } = require("./src/controller/discord/memberAdd");
const { insertCoins, getCoins, winCoins, loseCoins, findAllCoins } = require('./src/service/database/coinsService');
const { experienceSystem } = require('./src/service/database/experienceService');
const { createEmbedMessage, createHelp, fillArrayWithIcons, sendMessage, sendEmbedMessage } = require('./src/helper/discord');
const { playSong, skipSong, stopPlaylist, shufflePlaylist } = require('./src/controller/playlist/playlist');
const { validationPlay, userInChannel } = require('./src/controller/playlist/helper/validation');
const { secondsToMinute, mereceCoins, sendErrorConsole } = require('./src/helper/utils');
const dtdl = require('ytdl-core-discord');
const config = require('./config.json');
const array = require("./src/helper/arrays");

const prefix = config.discord.prefix;
const client = new Client();

client.login("NTczOTY4MTIwMDM3OTAwNDI2.XXSlfg.ZeC8VwAPX8bEA8un0sLsX17RJ-M"/*process.env.BOT_TOKEN*/);

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
                /*if (songs[message.guild.id]) {
                    let listSong = songs[message.guild.id];
                    let songRequest = listSong.queue;
                    if (songRequest.length > 0) {
                        for (let index = 0; index <= 10; index++) {
                            var playlistArray = [];
                            getSongInfo(songRequest[index].songUrl).then(value => {
                                let fields = {
                                    name: `${index}. Pedida por ${songRequest[index].userName}`,
                                    value: `[${value.info.title}](${value.info.url})`
                                };
                                playlistArray.push(fields);
                            }).catch(err => {
                                console.log(err);
                            });
                        }
                        embed = createEmbedMessage("Playlist", playlistArray, undefined, undefined);
                        message.channel.send(embed);
                    } else {
                        message.channel.send(`${message.author.toString()} no hay canciones en espera`);
                    }
                } else {
                    message.channel.send(`${message.author.toString()} la playlist está vacía`);
                }*/
                sendMessage("comando en construcción");
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
                        }];
                        sendEmbedMessage(createEmbedMessage("Banco del Distrito Federal de Puno", fields, "https://image.flaticon.com/icons/png/512/275/275806.png"));
                    } else {
                        sendMessage("no tienes coins. Usa el comando` + " `!daily`, message);
                    }
                }).catch(err => {
                    sendMessage("ocurrió un error al obtener tus coins");
                    sendErrorConsole(err);
                });
                break;
            case "daily":
                getCoins(message.author.id, message.guild.id).then(value => {
                    if (undefined == value.user.date) {
                        insertCoins(message.author.id, message.guild.id, message.author.username).then(value => {
                            message.channel.send(`${message.author.toString()} se han añadido $1000 a tu cuenta. Total: $${value.user.coins}`);
                        }).catch(err =>{
                            sendErrorConsole(err);
                        });
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
                });
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
                            let icons = fillArrayWithIcons(array.iconos);
                            message.channel.send(`${icons[0].icon} ${icons[1].icon} ${icons[2].icon}`);
                            let isArrayEquals = icons.every((val, i, arr) => val === arr[0]);
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
                }).catch(err => { });
                break;
            case "leaderboards":
                findAllCoins(message.guild.id).then(value => {

                }).catch(err => {
                    console.log(err);
                });
                break;
            case "ayuda":
                fields = createHelp();
                embed = createEmbedMessage(undefined, fields, undefined, undefined);
                message.channel.send(`${message.author.toString()} **Inbox perrito !** :incoming_envelope:`);
                message.author.send(embed);
                break;
            default:
                message.channel.send(`${message.author.toString()} no existe ese comando`);
        }
    } catch (err) {
        message.channel.send(`${message.author.toString()}, Ocurrió un error`);
        console.log(err);
    }
});

let playList = async (connection, message) => {
    let playlist = songs[message.guild.id];
    let requestSong = playlist.queue[0];
    playlist.dispatcher = connection.playOpusStream(await dtdl(requestSong.songUrl));
    if (playlist.queue.length > 0) {
        getSongInfo(requestSong.songUrl).then(value => {
            let thumbnail = getThumbnail(requestSong.songUrl);
            let fields = [{
                name: "Titulo de la canción",
                value: `[${value.info.title}](${value.info.url})`

            },
            {
                name: "Duración",
                value: secondsToMinute(parseInt(value.info.duration))
            }];
            let footer = {
                text: `Canción pedida por ${requestSong.userName}`,
                icon: requestSong.userAvatar
            };
            let embed = createEmbedMessage("Escuchando Ahora", fields, thumbnail, footer);
            message.channel.send(embed);
        }).catch(err => {
            message.channel.send(`Ocurrió un error obteniendo la información de la cancion.`);
            console.log(`Ocurrió un error obteniendo la información de la cancion: ` + err);
        });
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

let shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
}