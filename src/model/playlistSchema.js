const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId: String,
    userName: String,
    serverId: String,
    userAvatar: String,
    idSong: String,
    urlSong: String,
    nameSong: String
});

var playlistSchema = mongoose.model("playlist", schema);

exports.playlist = playlistSchema;