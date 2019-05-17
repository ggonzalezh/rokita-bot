const mongoose = require('mongoose');

const experiencia = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    userID: String,
    serverID: String,
    level: Number,
    puntos: Number,
    rango: String
});

module.exports = mongoose.model("experiencia", experiencia);