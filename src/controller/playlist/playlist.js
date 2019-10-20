const { validateUrl, getSongInfo, getThumbnail, youtubeSearch } = require('./helper/youtube');
const { secondsToMinute, sendErrorConsole } = require('../../helper/utils');
const { sendMessage } = require('../../helper/discord');
const { createEmbedMessage } = require('../../helper/discord');
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
        sendMessage("ocurrió un error con el comando `!play`", message);
        sendErrorConsole(err);
    }
};

exports.skipSong = (message) => {
    try {
        let listSongs = songs[message.guild.id];
        if (undefined != listSongs) {
            if (listSongs.dispatcher) {
                listSongs.dispatcher.end();
            }
        } else {
            sendMessage("no hay canciones en la playlist", message);
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!skip`", message);
        sendErrorConsole(err);
    }
};

exports.stopPlaylist = (message) => {
    try {
        if (message.guild.voiceConnection) {
            let stopPlaylist = songs[message.guild.id];
            stopPlaylist.queue.length = 0;
            message.guild.voiceConnection.disconnect();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!stop`", message);
        sendErrorConsole(err);
    }
};

exports.shufflePlaylist = (message) => {
    try {
        if (songs[message.guild.id]) {
            let shuffleSongs = songs[message.guild.id];
            if (undefined != shuffleSongs) {
                shuffle(shuffleSongs.queue);
                sendMessage("playlist re-ordenada", message);
            }
        } else {
            sendMessage("la playlist esta vacía", message);
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!shuffle`", message);
        sendErrorConsole(err);
    }
};

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
                    sendMessage("formato de canción no soportado", message);
                }
                break;
            case "spotify":
                sendMessage("esta en construcción la api de spotify", message);
                break;
            default:
                sendMessage("plataforma de la canción no soportada");
        }
    } catch (error) {
        sendMessage("ocurrió un error con el formato de la cancion");
        sendErrorConsole(err);
    }
}

let addYoutubeSong = (message, url) => {
    try {
        getSongInfo(url).then(value => {
            let songRequest = {
                userName: message.author.username,
                userAvatar: message.author.avatarURL,
                songUrl: value.info.url
            };
            let listSongs = songs[message.guild.id];
            listSongs.queue.push(songRequest);
            sendMessage("la canción `" + value.info.title + "` fue agregada a la playlist.", message);
            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then((connection) => {
                    playList(connection, message);
                });
            }
        }).catch(error => {
            sendMessage("ocurrió un error obteniendo la información de la canción", message);
            sendErrorConsole(error);
        });
    } catch (error) {
        sendMessage("ocurrió un error agregando la canción a la playlist");
        sendErrorConsole(err);
    }
};

let addYoutubePlaylist = (message, url) => {
    try {
        let listSongs = songs[message.guild.id];
        youtubePlaylist(url).then(value => {
            for (var song of value.data.playlist) {
                let songRequest = {
                    userName: message.author.username,
                    userAvatar: message.author.avatarURL,
                    songUrl: song.url
                };
                listSongs.queue.push(songRequest);
            }
            sendMessage("se agregaron `" + listSongs.queue.length + "` canciones a la playlist.")
            if (!message.guild.voiceConnection) {
                message.member.voiceChannel.join().then((connection) => {
                    playList(connection, message);
                });
            }
        }).catch(err => {
            sendMessage("ocurrió un error con la reproduccion de la playlist", message);
            sendErrorConsole(err);
        });
    } catch (err) {
        sendMessage("ocurrió un error con la reproduccion de la playlist", message);
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
        youtubeSearch(searchSong.trim()).then(value => {
            let url = "www.youtube.com" + value.song.songName.url;
            addYoutubeSong(message, url);
        }).catch(err => {
            sendMessage("ocurrió un error buscando la canción", message);
            sendErrorConsole(err);
        });
    } catch (err) {
        sendMessage("ocurrió un error buscando la canción", message);
        sendErrorConsole(err);
    }
}

let playList = async (connection, message) => {
    try {
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
                sendMessage("ocurrió un error obteniendo la información de la canción", message);
                sendErrorConsole(err);
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

    } catch (err) {
        sendMessage("ocurrió un error con la reproducción de canciones", message);
        sendErrorConsole(err);
    }
};
