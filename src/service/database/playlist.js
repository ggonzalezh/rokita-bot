const { playlist } = require('../../model/playlistSchema');

exports.insertPlaylist = (username, userId, avatar, url, nameSong, idSong, idGuild) => {
    let newPlaylist = new playlist({
        userName: username,
        userId: userId,
        avatar: avatar,
        url: url,
        nameSong: nameSong,
        idSong: idSong,
        guildId: idGuild
    });

    newPlaylist.save().catch(err => console.log(err));
}

exports.getPlaylist = async (userId, idSong, idGuild) => {
    var song = await get(userId, idSong, idGuild);

    return song;
}

exports.deletePlaylist = (userId, idSong, idGuild) => {
    playlist.findOneAndDelete({
        userId: userId,
        idSong: idSong,
        guildId: idGuild
    }, (err, res) => {
        if (err) {
            console.log("Ocurrio un error en el metodo deletePlayList: " + err);
            return;
        }
    });
}

var get = (userId, idSong, idGuild) => {
    return new Promise((resolve) => {
        playlist.findOne({
            userId: userId,
            idSong: idSong,
            guildId: idGuild
        }, (err, res) => {
            if (err) {
                console.log("Ocurrio un error en el metodo getPlaylist: " + err);
            } else {
                resolve({
                    song: {
                        nameSong: res.nameSong,
                        idSong: res.idSong,
                        userId: res.userId,
                        userName: res.userName
                    }
                })
            }
        });
    })
}