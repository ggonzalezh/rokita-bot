const ytdl = require("ytdl-core");
const ytsr = require('ytsr');
const ytpl = require('ytpl');

exports.getPlaylistYoutube = (uri) => {
    return new Promise((resolve, reject) => {
        ytpl(uri, {limit: 100},(err, res) => {
            if(err || undefined === res){
                reject({
                    error:{
                        err
                    }
                })
            }else{
                resolve({
                    playlist: {
                        list: res.items
                    }
                })
            }
        })
    })
}

exports.getSongInfo = (uri) => {
    return new Promise((resolve, reject) => {
        ytdl.getBasicInfo(uri, (err, res) => {
            if (err || undefined === res) {
                reject({
                    error: {
                        err
                    }
                })
            } else {
                resolve({
                    song: {
                        title: res.title
                    }
                })
            }
        }).then()
    })
};

exports.youtubeSearch = (songName) => {
    return new Promise((resolve, reject) => {
        ytsr(songName, (err, res) => {
            if (err || undefined === res) {
                reject({
                    error: {
                        err
                    }
                })
            } else {
                resolve({
                    song: {
                        title: res.items[0].title,
                        url: res.items[0].link,
                        thumbnail: res.items[0].thumbnail,
                        duration: res.items[0].duration
                    }
                })
            }
        })
    })
};

exports.validateSongYoutube = (uri) => ytdl.validateURL(uri);
exports.validatePlaylistYoutube = (url) => ytpl.validateURL(url);

