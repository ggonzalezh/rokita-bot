const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId : Number,
    serverId : Number,
    userName: String,
    coins: Number,
    lastUpdate: String
});

exports.coinSchema = mongoose.model("coins", schema);