const { playlist } = require('../../model/playlistSchema');

exports.insertPlaylist = (userId, userName, serverId, userAvatar, idSong, urlSong, nameSong) => {
    insertPlaylistService(userId, userName, serverId, userAvatar, idSong, urlSong, nameSong);
}

exports.getPlaylist = async (userId, idSong, serverId) => {
    return await getPlaylistService(userId, idSong, serverId);
}

exports.deletePlaylist = (userId, idSong, serverId) => {
    deletePlaylistService(userId, idSong, serverId);
}

var getPlaylistService = (userId, idSong, idGuild) => {
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

var insertPlaylistService = (userId, userName, serverId, userAvatar, idSong, urlSong, nameSong) => {
    let newPlaylist = new playlist({
        userId: userId,
        userName: userName,
        serverId: serverId,
        userAvatar: userAvatar,
        idSong: idSong,
        urlSong: urlSong,
        nameSong: nameSong
    });

    newPlaylist.save().catch(err => console.log(err));
}

var deletePlaylistService = (userId, idSong, serverId) => {
    playlist.findOneAndDelete({
        userId: userId,
        idSong: idSong,
        serverId: serverId
    }, (err, res) => {
        if (err) {
            console.log("Ocurrió un error en el metodo deletePlayList: " + err);
        }
    });
}