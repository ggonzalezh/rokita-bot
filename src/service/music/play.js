const dtdl = require('ytdl-core-discord');
var songs = {};

exports.playSong = (message, uri = undefined, action) => {
    if( action == "add"){
        addSong(message, uri);
    }

    if ( action == "skip"){
        skipSong(message);
    }
}


var play = async (connection, message) => {
    let playlist = songs[message.guild.id];
    playlist.dispatcher = connection.playOpusStream(await dtdl(playlist.queue[0]));
    playlist.queue.shift();
};

var endPlay = (playlist, connection, message) => {
    playlist.dispatcher.on("end", () => {
        if (playlist.queue[0]) {
            this.playSong(connection, message)
        } else {
            connection.disconnect();
        }
    });
};

var addSong = (message, uri) => {
    if (!songs[message.guild.id]) {
        songs[message.guild.id] = {
            queue: []
        }
    }

    let listSongs = songs[message.guild.id];

    listSongs.queue.push(uri);
    if (!message.guild.voiceConnection) {
        message.member.voiceChannel.join().then((connection) => {
            play(connection, message)
        });
    }
}

var skipSong = (message) => {
    let listSongs = songs[message.guild.id];
    if (listSongs.dispatcher) {
        listSongs.dispatcher.end();
    }
}

