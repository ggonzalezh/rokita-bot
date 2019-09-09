const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userName: String,
    userId: String,
    serverId: String,
    avatar: String,
    url: String,
    nameSong: String,
    idSong: String,
    guildId: String
});

var playlistSchema = mongoose.model("playlist", schema);

exports.playlist = playlistSchema;