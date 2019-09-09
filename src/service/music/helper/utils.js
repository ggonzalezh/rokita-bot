const ytdl = require("ytdl-core");
const { createEmbedMessage } = require('../../../helper/discord');
const { insertPlaylist, getPlaylist, deletePlaylist } = require('../../../service/database/playlist')
var youtubeThumbnail = require('youtube-thumbnail');
const array = require('../../../helper/arrays');
const config = require('../../../../config.json')

exports.getSongInfo = async (uri, username, avatar, current, message) => {
    let song = await ytdlInfo(uri);
    var embed;
    var thumbnail = getThumbnail(uri);
    if (song != undefined) {
        if (current == 'isSoon') {
            /*var playlist = getPlaylist(message.author.id, song.info.id, message.guild.id);
            let fields = [{
                name: "Escuchando",
                value: playlist.song.nameSong
            }]
            let footer = {
                text: array.lePusiste[Math.floor(Math.random() * array.lePusiste.length)] + " " + playlist.song.userName,
                icon: avatar
            }
            embed = createEmbedMessage("Playlist", fields, config.discord.brokaDance, footer);
            deletePlaylist(message.author.id, song.info.id, message.guild.id);*/
        } else {
            let fields = [{
                name: "Título de la canción",
                value: song.info.title,

            }]
            let footer = {
                text: username + ", la canción fue agregada a la playlist",
                icon: avatar
            }
            //insertPlaylist(username, message.author.id, avatar, uri, song.info.title, song.info.id, message.guild.id);
            embed = createEmbedMessage("Playlist", fields, thumbnail, footer);
        }
    }

    return embed;
};

exports.validateUrl = (uri) => {
    var isValidate = ytdl.validateURL(uri);
    return isValidate;
}

var ytdlInfo = (uri) => {
    return new Promise((resolve) => {
        ytdl.getInfo(uri, (err, res) => {
            if (res) {
                resolve({
                    info: {
                        title: res.title,
                        id: res.video_id,
                        duration: res.length_seconds
                    }

                })
            } else {
                resolve({
                    info: undefined
                })
            }
        })
    })
}

var getThumbnail = (uri) => {
    let image = youtubeThumbnail(uri);
    return image.high.url;
}