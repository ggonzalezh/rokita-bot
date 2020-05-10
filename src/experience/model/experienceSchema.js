const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId : Number,
    serverId : Number,
    userName: String,
    level: Number,
    experience: Number,
    range: String,
    nextExperienceToLevelUp: Number,
    lastUpdate: String
});

let experienceSchema = mongoose.model("level", schema);

exports.experience = experienceSchema;