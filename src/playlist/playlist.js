const {validateUrl, getSongInfo, getThumbnail, youtubeSearch} = require('./helper/youtube');
const {secondsToMinute, sendErrorConsole} = require('../helper/utils');
const {sendMessage, sendEmbedMessage, createEmbedMessage, editMessage} = require('../discord/message');
const youtubePlaylist = require("youtube-playlist");
const dtdl = require('ytdl-core-discord');

let playlist = {};

exports.playSongs = (message, args) => {
    try {
        if (!playlist[message.guild.id]) {
            playlist[message.guild.id] = {
                queue: [],
                paused: false
            }
        }
        if (args[1].includes("https://")) {
            addSongToPlaylist(message, args[1]);
        } else {
            searchSongYoutube(message, args);
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!play`", message).then();
        sendErrorConsole(err);
    }
};

exports.skipPlaylist = (message) => {
    try {
        if (undefined !== playlist[message.guild.id]) {
            if (playlist[message.guild.id].dispatcher) {
                playlist[message.guild.id].dispatcher.end();
                message.react('⏩').then();
            }
        } else {
            sendMessage("no hay canciones en la playlist.", message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!skip`", message).then();
        sendErrorConsole(err);
    }
};

exports.pausePlaylist = (message) => {
    try {
        if (undefined !== playlist[message.guild.id] && playlist[message.guild.id].dispatcher) {
            if (playlist[message.guild.id].paused === false) {
                playlist[message.guild.id].dispatcher.pause(true);
                playlist[message.guild.id].paused = true;
                message.react('⏸').then();
            } else {
                sendMessage("la `playlist` esta pausada.", message).then();
            }
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!pause`", message).then();
        sendErrorConsole(err);
    }
};

exports.resumePlaylist = (message) => {
    try {
        if (undefined !== playlist[message.guild.id] && playlist[message.guild.id].dispatcher) {
            if (playlist[message.guild.id].paused === true) {
                playlist[message.guild.id].dispatcher.resume();
                playlist[message.guild.id].paused = false;
                message.react('▶').then();
            } else {
                sendMessage("la `playlist` no esta pausada.", message).then();
            }
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!resume`", message).then();
        sendErrorConsole(err);
    }
}

exports.stopPlaylist = (message) => {
    try {
        if (message.guild.voice) {
            playlist[message.guild.id].queue.length = 0;
            if (message.guild.voice.channel) {
                message.guild.voice.channel.leave();
                playlist = {};
                message.react('🛑').then();
            }
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!stop`", message).then();
        sendErrorConsole(err);
    }
};

exports.shufflePlaylist = (message) => {
    try {
        if (playlist[message.guild.id]) {
            if (undefined !== playlist[message.guild.id]) {
                playlist[message.guild.id].queue.sort(() => Math.random() - 0.5);
                message.react('🔀').then();
            }
        } else {
            sendMessage("la playlist esta vacía", message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!shuffle`", message).then();
        sendErrorConsole(err);
    }
};

exports.getPlaylist = (message) => {
    try {
        if (playlist[message.guild.id]) {
            let songRequest = playlist[message.guild.id].queue
            if (songRequest.length > 0) {
                let playlistArray = []
                let index = 0;
                for (const song of songRequest) {
                    index = index + 1;
                    let fields = {
                        name: `${index}- Pedida por ${song.userName}`,
                        value: `[${song.songTitle}](${song.songUrl})`
                    }
                    playlistArray.push(fields);
                    if (index >= 5) {
                        break;
                    }
                }
                let footer = {
                    text: `Siguientes canciones`
                }
                let embed = createEmbedMessage("Playlist", playlistArray, undefined, footer);
                sendEmbedMessage(embed, message);
            } else {
                sendMessage("no hay canciones en espera", message).then();
            }
        } else {
            sendMessage('no hay canciones en espera', message).then();
        }
    } catch (err) {
        sendMessage('ocurrió un error obteniendo la playlist', message).then();
        sendErrorConsole(err);
    }
}

let addSongToPlaylist = (message, url) => {
    try {
        let platform = url.split(".");
        switch (platform[1]) {
            case "youtube":
                if (validateUrl(url)) {
                    addYoutubeSong(message, url);
                } else if (url.includes('playlist')) {
                    addYoutubePlaylist(message, url);
                } else {
                    sendMessage("formato de canción no soportado", message).then();
                }
                break;
            default:
                sendMessage("plataforma de la canción no soportada").then();
        }
    } catch (error) {
        sendMessage("ocurrió un error con el formato de la canción").then();
        sendErrorConsole(error);
    }
}

let addYoutubeSong = (message, url, messageId) => {
    try {
        getSongInfo(url).then(value => {
            let songRequest = {
                userName: message.author.username,
                userAvatar: message.author.avatarURL,
                songUrl: value.info.url,
                songTitle: value.info.title
            };
            playlist[message.guild.id].queue.push(songRequest);
            if (messageId) {
                editMessage(messageId, message.author.toString() + ", la canción `" + value.info.title + "` fue agregada a la playlist.", message.channel)
            } else {
                sendMessage("la canción `" + value.info.title + "` fue agregada a la playlist.", message).then();
            }
            if (!message.guild.voice || !message.guild.voice.channel) {
                message.member.voice.channel.join().then((connection) => {
                    playSong(connection, message).then();
                });
            }
        }).catch(error => {
            sendMessage("ocurrió un error obteniendo la información de la canción", message).then();
            sendErrorConsole(error);
        });
    } catch (error) {
        sendMessage("ocurrió un error agregando la canción a la playlist").then();
        sendErrorConsole(error);
    }
};

let addYoutubePlaylist = (message, url) => {
    try {
        youtubePlaylist(url).then(value => {
            let canciones = 0;
            for (let song of value.data.playlist) {
                let songRequest = {
                    userName: message.author.username,
                    userAvatar: message.author.avatarURL,
                    songUrl: song.url,
                    songTitle: song.name
                };
                playlist[message.guild.id].queue.push(songRequest);
                canciones++;
            }
            sendMessage("se agregaron `" + canciones + "` canciones a la playlist.", message).then();
            if (!message.guild.voice || !message.guild.voice.channel) {
                message.member.voice.channel.join().then((connection) => {
                    playSong(connection, message).then();
                });
            }
        }).catch(err => {
            sendMessage("ocurrió un error con la reproduccion de la playlist", message).then();
            sendErrorConsole(err);
        });
    } catch (err) {
        sendMessage("ocurrió un error con la reproduccion de la playlist", message).then();
        sendErrorConsole(err);
    }
};

let searchSongYoutube = (message, args) => {
    try {
        let searchSong = "";
        for (let index = 1; index < args.length; index++) {
            let songArgs = args[index];
            searchSong = searchSong + " " + songArgs;
        }
        sendMessage(":mag_right: **Buscando:**  `" + searchSong.trim().toUpperCase() + "`", message).then(messageId => {
            youtubeSearch(searchSong.trim()).then(value => {
                let url = "www.youtube.com" + value.song.songName.url;
                addYoutubeSong(message, url, messageId);
            }).catch(err => {
                sendMessage("ocurrió un error buscando la canción", message).then();
                sendErrorConsole(err);
            });
        });
    } catch (err) {
        sendMessage("ocurrió un error buscando la canción", message).then();
        sendErrorConsole(err);
    }
}

let playSong = async (connection, message) => {
    try {
        playlist[message.guild.id].dispatcher = connection.play(await dtdl(playlist[message.guild.id].queue[0].songUrl, {
            filter: "audioonly",
            highWaterMark: 1 << 25
        }), {type: 'opus'});
        if (playlist[message.guild.id].queue.length > 0) {
            getSongInfo(playlist[message.guild.id].queue[0].songUrl).then(value => {
                let thumbnail = getThumbnail(playlist[message.guild.id].queue[0].songUrl);
                let fields = [{
                    name: "Titulo de la canción",
                    value: `[${value.info.title}](${value.info.url})`

                },
                    {
                        name: "Duración",
                        value: secondsToMinute(parseInt(value.info.duration))
                    }];
                let footer = {
                    text: `Canción pedida por ${playlist[message.guild.id].queue[0].userName}`,
                    icon: playlist[message.guild.id].queue[0].userAvatar
                };
                playlist[message.guild.id].queue.shift();
                playlist[message.guild.id].dispatcher.on("finish", () => {
                    if (playlist[message.guild.id].queue[0]) {
                        playSong(connection, message);
                    } else {
                        connection.disconnect();
                    }
                });
                sendEmbedMessage(createEmbedMessage("Escuchando Ahora", fields, thumbnail, footer), message);
            }).catch(err => {
                sendMessage("ocurrió un error obteniendo la información de la canción", message);
                sendErrorConsole(err);
                sendMessage(playlist[message.guild.id].queue[0].songUrl, message);
            });
        }

    } catch (err) {
        sendMessage("No se ha podido reproducir la canción. **Siguiente canción** :fast_forward:", message).then();
        sendErrorConsole(err);
        playlist[message.guild.id].queue.shift();
        playSong(connection, message).then();
    }
};