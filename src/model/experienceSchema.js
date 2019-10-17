const mongoose = require('mongoose');

const schema = mongoose.Schema({
    username: String,
    userID: String,
    serverID: String,
    level: Number,
    puntos: Number,
    rango: String
});

let experienceSchema = mongoose.model("experiencias", schema);

exports.experience = experienceSchema;