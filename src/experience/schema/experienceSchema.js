const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId : Number,
    serverId : Number,
    userName: String,
    level: Number,
    experience: Number,
    range: String,
    experienceToLevelUp: Number,
    totalExperience: Number,
    lastUpdate: String
});

exports.experienceSchema = mongoose.model("experience", schema);