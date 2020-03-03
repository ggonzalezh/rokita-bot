const { validateUrl, getSongInfo, getThumbnail, youtubeSearch } = require('./helper/youtube');
const { secondsToMinute, sendErrorConsole } = require('../helper/utils');
const { sendMessage, sendEmbedMessage } = require('../helper/discord');
const { createEmbedMessage } = require('../helper/discord');
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
    skipSongYoutube(message);
};

exports.stopPlaylist = (message) => {
    try {
        if (message.guild.voiceConnection) {
            let stopPlaylist = songs[message.guild.id];
            stopPlaylist.queue.length = 0;
            message.guild.voiceConnection.disconnect();
            sendMessage(":mute: **Playlist detenida**", message);
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
                sendMessage(":twisted_rightwards_arrows: **Playlist re-ordenada**", message);
            }
        } else {
            sendMessage("la playlist esta vacía", message);
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!shuffle`", message);
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
                    fields = {
                        name: `${index}- Pedida por ${song.userName}`,
                        value: `[${song.songTitle}](${song.songUrl})`
                    }
                    playlistArray.push(fields);
                    if(index >= 5){
                        break;
                    }
                }
                let footer = {
                    text: `Siguientes canciones`
                }
                embed = createEmbedMessage("Playlist", playlistArray, undefined, footer);
                sendEmbedMessage(embed, message);
            } else {
                sendMessage("no hay canciones en espera", message);   
            }
        }else{
            sendMessage('no hay canciones en espera', message);
        }
    } catch (err) {
        sendMessage('ocurrió un error obteniendo la playlist', message);
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
        sendMessage("ocurrió un error con el formato de la canción");
        sendErrorConsole(err);
    }
}

let addYoutubeSong = (message, url) => {
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
                    songUrl: song.url,
                    songTitle: song.name
                };
                listSongs.queue.push(songRequest);
            }
            sendMessage("se agregaron `" + listSongs.queue.length + "` canciones a la playlist.", message);
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
        sendMessage(":mag_right: **Buscando:**  `" + searchSong.trim().toUpperCase() + "`", message);
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
    let playlist = songs[message.guild.id];
    try {
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
                sendEmbedMessage(createEmbedMessage("Escuchando Ahora", fields, thumbnail, footer), message);
            }).catch(err => {
                sendMessage("ocurrió un error obteniendo la información de la canción", message);
                sendErrorConsole(err);
                sendMessage(requestSong.songUrl, message);
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
        sendMessage("No se ha podido reproducir la canción. :fast_forward: **Siguiente canción**", message);
        sendErrorConsole(err);
        playlist.queue.shift();
        playList(connection, message);
    }
};

let shuffle = (array) => {
    array.sort(() => Math.random() - 0.5);
};

let skipSongYoutube = (message) => {
    try {
        let listSongs = songs[message.guild.id];
        if (undefined != listSongs) {
            if (listSongs.dispatcher) {
                listSongs.dispatcher.end();
                sendMessage(":fast_forward: **Siguiente canción**", message);
            }
        } else {
            sendMessage("no hay canciones en la playlist", message);
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!skip`", message);
        sendErrorConsole(err);
    }
};
