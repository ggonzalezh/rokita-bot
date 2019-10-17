const ytdl = require("ytdl-core");
const youtubeThumbnail = require('youtube-thumbnail');
const youtubePlaylist = require("youtube-playlist");

exports.getSongInfo = async (uri) => {
    return await ytdlInfo(uri);
};

exports.validateUrl = (uri) => {
    return ytdl.validateURL(uri);
};

exports.getThumbnail = (uri) => {
    return getThumbnailService(uri);
};

exports.getYoutubePlaylist = (uri) => {
    youtubePlaylist(uri, 'url').then(value => {
        return value
    }).catch(err => {

    });
}

let ytdlInfo = (uri) => {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(uri, (err, res) => {
            if (err) {
                reject({
                    error: {
                        err
                    }
                })
            } else {
                resolve({
                    info: {
                        id: res.video_id,
                        url: res.video_url,
                        title: res.title,
                        duration: res.length_seconds
                    }

                })
            }
        })
    })
};

let getThumbnailService = (uri) => {
    let image = youtubeThumbnail(uri);
    return image.high.url;
};

let getPlaylistYoutube = (uri) => {
    return new Promise((resolve, reject) => {
        youtubePlaylist(uri, 'url').then(value => {
            resolve({
                value
            })
        });
    });
};