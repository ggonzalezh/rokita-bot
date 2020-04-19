const { validateUrl, getSongInfo, getThumbnail, youtubeSearch } = require('./helper/youtube');
const { secondsToMinute, sendErrorConsole, setTimeout } = require('../helper/utils');
const { sendMessage, sendEmbedMessage, createEmbedMessage, editMessage } = require('../discord/message');
const youtubePlaylist = require("youtube-playlist");
const dtdl = require('ytdl-core-discord');

let songs = {};

exports.playSong = (message, args) => {
    try {
        if (!songs[message.guild.id]) {
            songs[message.guild.id] = {
                queue: []
            }
        }
        let isLink = args[1].includes("https://");
        if (isLink) {
            addToPlaylist(message, args[1]);
        } else {
            searchSongYoutube(message, args);
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!play`", message).then();
        sendErrorConsole(err);
    }
};

exports.skipSong = (message) => {
    skipSongYoutube(message);
};

exports.stopPlaylist = (message) => {
    try {
        if (message.guild.voice) {
            let stopPlaylist = songs[message.guild.id];
            stopPlaylist.queue.length = 0;
            if(message.guild.voice.channel){
                message.guild.voice.channel.leave();
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
        if (songs[message.guild.id]) {
            let shuffleSongs = songs[message.guild.id];
            if (undefined !== shuffleSongs) {
                shuffle(shuffleSongs.queue);
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
        if (songs[message.guild.id]) {
            let listSong = songs[message.guild.id]
            let songRequest = listSong.queue
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

let addToPlaylist = (message, url) => {
    try {
        let platform = url.split(".");
        switch (platform[1]) {
            case "youtube":
                let isValidLink = validateUrl(url);
                if (isValidLink) {
                    addYoutubeSong(message, url);
                } else if (url.includes('playlist')) {
                    addYoutubePlaylist(message, url);
                } else {
                    sendMessage("formato de canción no soportado", message).then();
                }
                break;
            case "spotify":
                sendMessage("esta en construcción la api de spotify", message).then();
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
            let listSongs = songs[message.guild.id];
            listSongs.queue.push(songRequest);
            if (messageId) {
                editMessage(messageId, message.author.toString() + ", la canción `" + value.info.title + "` fue agregada a la playlist.", message.channel)
            } else {
                sendMessage("la canción `" + value.info.title + "` fue agregada a la playlist.", message).then();
            }
            if (!message.guild.voice || !message.guild.voice.channel) {
                message.member.voice.channel.join().then((connection) => {
                    playList(connection, message).then();
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
        let listSongs = songs[message.guild.id];
        youtubePlaylist(url).then(value => {
            for (let song of value.data.playlist) {
                let songRequest = {
                    userName: message.author.username,
                    userAvatar: message.author.avatarURL,
                    songUrl: song.url,
                    songTitle: song.name
                };
                listSongs.queue.push(songRequest);
            }
            sendMessage("se agregaron `" + listSongs.queue.length + "` canciones a la playlist.", message).then();
            if (!message.guild.voice.connection) {
                message.member.voice.channel.join().then((connection) => {
                    playList(connection, message).then();
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

let playList = async (connection, message) => {
    let playlist = songs[message.guild.id];
    try {
        let requestSong = playlist.queue[0];
        playlist.dispatcher = connection.play(await dtdl(requestSong.songUrl, {
            filter: "audioonly",
            highWaterMark: 1 << 25
        }), {type: 'opus'});
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
                sendEmbedMessage(createEmbedMessage("Escuchando Ahora", fields, thumbnail, footer), message);
            }).catch(err => {
                sendMessage("ocurrió un error obteniendo la información de la canción", message);
                sendErrorConsole(err);
                sendMessage(requestSong.songUrl, message);
            });
        }
        playlist.queue.shift();
        playlist.dispatcher.on("finish", () => {
            if (playlist.queue[0]) {
                playList(connection, message);
            } else {
                connection.disconnect();
            }
        });

    } catch (err) {
        sendMessage("No se ha podido reproducir la canción. **Siguiente canción** :fast_forward:", message).then();
        sendErrorConsole(err);
        playlist.queue.shift();
        playList(connection, message).then();
    }
};

let shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
};

let skipSongYoutube = (message) => {
    try {
        let listSongs = songs[message.guild.id];
        if (undefined !== listSongs) {
            if (listSongs.dispatcher) {
                listSongs.dispatcher.end();
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
