const ytdl = require("ytdl-core");
var youtubeThumbnail = require('youtube-thumbnail');

exports.getSongInfo = async (uri) => {
    return await ytdlInfo(uri);
};

exports.validateUrl = (uri) => {
    return ytdl.validateURL(uri);
}

exports.getThumbnail = (uri) => {
    return getThumbnailService(uri);
}

var ytdlInfo = (uri) => {
    return new Promise((resolve, reject) => {
        ytdl.getInfo(uri, (err, res) => {
            if (err) {
                reject({
                    error:{
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
}

var getThumbnailService = (uri) => {
    let image = youtubeThumbnail(uri);
    return image.high.url;
}