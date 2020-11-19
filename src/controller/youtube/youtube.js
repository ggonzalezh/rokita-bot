import ytdl from 'ytdl-core'
import ytsr from 'ytsr'
import ytpl from 'ytpl'

const getPlaylistYoutube = (uri) => {
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

const getSongInfo = (uri) => {
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

const youtubeSearch = (songName) => {
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

const validateSongYoutube = (uri) => ytdl.validateURL(uri);
const validatePlaylistYoutube = (url) => ytpl.validateURL(url);

