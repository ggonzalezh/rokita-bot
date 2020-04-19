const ytdl = require("ytdl-core");
const youtubeThumbnail = require('youtube-thumbnail');
const youtubeSearch = require("yt-search");

exports.getSongInfo = async (uri) => {
    return await ytdlInfo(uri);
};

exports.validateUrl = (uri) => {
    return ytdl.validateURL(uri);
};

exports.getThumbnail = (uri) => {
    return getThumbnailService(uri);
};

exports.youtubeSearch = async (songName) => {
    return await getSongFromYoutube(songName);
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
        }).then()
    })
};

let getThumbnailService = (uri) => {
    let image = youtubeThumbnail(uri);
    return image.high.url;
};

let getSongFromYoutube = (songName) => {
    return new Promise((resolve, reject) => {
        youtubeSearch(songName, (err, res) => {
            if(err){
                reject({
                    error:{
                        err
                    }
                })
            }else{
                resolve({
                    song:{
                        songName:res.videos[0]
                    }
                })
            }
        })
    })
}