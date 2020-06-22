const {validateSongYoutube, getSongInfo, youtubeSearch, getPlaylistYoutube, validatePlaylistYoutube} = require('./helper/youtube');
const {sendErrorConsole} = require('../helper/utils');
const {sendMessage, sendEmbedMessage, createEmbedMessage, editMessage} = require('../discord/message');
const dtdl = require('ytdl-core-discord');

let playlist = {};


exports.play = (message, args) => {
    try {
        if (!playlist[message.guild.id]) playlist[message.guild.id] = {queue: [], paused: false};
        (args[1].includes('.youtube.')) ? addSongToPlaylist(message, args[1]) : searchSongYoutube(message, args);
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!play`", message).then();
        sendErrorConsole(err);
    }
};

exports.skip = (message) => {
    try {
        if (playlist[message.guild.id] && playlist[message.guild.id].dispatcher && playlist[message.guild.id].queue.length > 0) {
            playlist[message.guild.id].dispatcher.end();
            message.react('⏩').then();
        } else {
            sendMessage("no hay más canciones en la playlist.", message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!skip`", message).then();
        sendErrorConsole(err);
    }
};

exports.stop = (message) => {
    try {
        if (message.guild.voice && message.guild.voice.channel) {
            playlist[message.guild.id].dispatcher.end();
            playlist[message.guild.id].queue = [];
            message.guild.voice.channel.leave();
            message.react('🛑').then();
        } else {
            sendMessage('no hay música en reproducción.', message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!stop`", message).then();
        sendErrorConsole(err);
    }
};

exports.pause = (message) => {
    try {
        if (playlist[message.guild.id] && playlist[message.guild.id].dispatcher && playlist[message.guild.id].paused === false) {
            playlist[message.guild.id].dispatcher.pause();
            playlist[message.guild.id].paused = true;
            message.react('⏸').then();
        } else {
            sendMessage("la `playlist` esta pausada.", message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!pause`", message).then();
        sendErrorConsole(err);
    }
};

exports.resume = (message) => {
    try {
        if (playlist[message.guild.id] && playlist[message.guild.id].dispatcher && playlist[message.guild.id].paused === true) {
            playlist[message.guild.id].dispatcher.resume();
            playlist[message.guild.id].paused = false;
            message.react('▶').then();
        } else {
            sendMessage("la `playlist` no esta pausada.", message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!resume`", message).then();
        sendErrorConsole(err);
    }
}

exports.shuffle = (message) => {
    try {
        if (playlist[message.guild.id] && playlist[message.guild.id].queue.length > 0) {
            playlist[message.guild.id].queue.sort(() => Math.random() - 0.5);
            message.react('🔀').then();
        } else {
            sendMessage("la playlist esta vacía.", message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!shuffle`", message).then();
        sendErrorConsole(err);
    }
};

exports.playlist = (message) => {
    try {
        if (playlist[message.guild.id] && playlist[message.guild.id].queue && playlist[message.guild.id].queue.length > 0) {
            let playlistArray = []
            let index = 0;
            for (const song of playlist[message.guild.id].queue) {
                index = index + 1;
                let fields = {
                    name: `${index}. ${song.userName}`,
                    value: `[${song.songTitle}](${song.songUrl})`
                }
                playlistArray.push(fields);
                if (index >= 5) {
                    break;
                }
            }
            let embed = createEmbedMessage("Siguientes canciones", playlistArray, undefined);
            sendEmbedMessage(embed, message);
        } else {
            sendMessage("no hay canciones en espera", message).then();
        }
    } catch (err) {
        sendMessage('ocurrió un error obteniendo la playlist', message).then();
        sendErrorConsole(err);
    }
}

exports.setVolumen = (message, nivelVolumen) => {
    try {
        if (!playlist[message.guild.id] && !playlist[message.guild.id].dispatcher && nivelVolumen === undefined) return;
        if (nivelVolumen >= 0 && nivelVolumen <= 2) {
            playlist[message.guild.id].dispatcher.setVolume(nivelVolumen);
            (nivelVolumen) <= 1 ? message.react('🔉').then() : message.react('🔊').then();
        } else {
            sendMessage("los niveles de volumen van desde `0` al `2`. Acepta digitos decimales. (`0 = 0%`, `0.5 = 50%`, `1= 100%`, `1.5 = 150%`, `2 = 200%`).", message).then();
        }
    } catch (err) {
        sendMessage("ocurrió un error con el comando `!volumen`", message).then();
        sendErrorConsole(err);
    }
}

const addSongToPlaylist = (message, url) => {
    try {
        let platform = url.split(".");
        switch (platform[1]) {
            case "youtube":
                if (validatePlaylistYoutube(url)) {
                    addYoutubePlaylist(message, url);
                } else if (validateSongYoutube(url)) {
                    getSongInfo(url).then(value => {
                        youtubeSearch(value.song.title).then(response => {
                            addYoutubeSong(message, response.song);
                        })
                    });
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

const addYoutubeSong = (message, song, messageId) => {
    try {
        playlist[message.guild.id].queue.push(createSongRequest(song, message));
        (messageId) ? editMessage(messageId, message.author.toString() + ", la canción `" + song.title + "` fue agregada a la playlist.", message.channel)
            : sendMessage("la canción `" + song.title + "` fue agregada a la playlist.", message).then();
        if (!message.guild.voice || !message.guild.voice.channel) message.member.voice.channel.join().then((connection) => {
            playSong(connection, message).then();
        });
    } catch (error) {
        sendMessage("ocurrió un error agregando la canción a la playlist").then();
        sendErrorConsole(error);
    }
};

const addYoutubePlaylist = (message, url) => {
    try {
        getPlaylistYoutube(url).then(value => {
            let canciones = 0;
            for (let song of value.playlist.list) {
                playlist[message.guild.id].queue.push(createSongRequest(song, message));
                canciones++;
            }
            sendMessage("se agregaron `" + canciones + "` canciones a la playlist.", message).then();
            if (!message.guild.voice || !message.guild.voice.channel) joinChannel(message);
        }).catch(err => {
            sendMessage("ocurrió un error con la reproduccion de la playlist", message).then();
            sendErrorConsole(err);
        });
    } catch (err) {
        sendMessage("ocurrió un error con la reproduccion de la playlist", message).then();
        sendErrorConsole(err);
    }
};

const searchSongYoutube = (message, args) => {
    try {
        let searchSong = '';
        for (let index = 1; index < args.length; index++) {
            let songArgs = args[index];
            searchSong = searchSong + " " + songArgs;
        }
        sendMessage(":mag_right: **Buscando:**  `" + searchSong.trim().toUpperCase() + "`", message).then(messageId => {
            youtubeSearch(searchSong.trim()).then(value => {
                addYoutubeSong(message, value.song, messageId);
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

const playSong = async (connection, message) => {
    try {
        playlist[message.guild.id].dispatcher = connection.play(await dtdl(playlist[message.guild.id].queue[0].songUrl, {
            filter: "audioonly",
            highWaterMark: 1 << 25,
            quality: 'highestaudio',
            volume: 0.8
        }), {type: 'opus'}).on('finish', () => {
            if (playlist[message.guild.id].queue[0]) {
                playSong(connection, message);
            } else {
                playlist[message.guild.id].queue = [];
                connection.disconnect();
            }
        });
        let fields = [{
            name: "Titulo de la canción",
            value: `[${playlist[message.guild.id].queue[0].songTitle}](${playlist[message.guild.id].queue[0].songUrl})`
        },
            {
                name: "Duración",
                value: playlist[message.guild.id].queue[0].duration
            }];
        let footer = {
            text: `Canción pedida por ${playlist[message.guild.id].queue[0].userName}`,
            icon: playlist[message.guild.id].queue[0].userAvatar
        };
        sendEmbedMessage(createEmbedMessage("Escuchando Ahora", fields, playlist[message.guild.id].queue[0].thumbnail, footer), message);
        playlist[message.guild.id].queue.shift();
    } catch (err) {
        sendMessage("No se ha podido reproducir la canción. **Siguiente canción** :fast_forward:", message).then();
        sendErrorConsole(err);
        playlist[message.guild.id].queue.shift();
        playlist[message.guild.id].dispatcher.end();
    }
};

const joinChannel = (message) => {
    message.member.voice.channel.join().then((connection) => {
        playSong(connection, message).then();
    });
}

const createSongRequest = (song, message) => {
    let songRequest = {
        userName: message.author.username,
        userAvatar: message.author.avatarURL(),
        songUrl: song.url,
        songTitle: song.title,
        thumbnail: song.thumbnail,
        duration: song.duration
    };

    return songRequest;
}