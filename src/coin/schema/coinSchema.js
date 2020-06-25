const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userId : String,
    serverId : String,
    userName: String,
    coins: Number,
    lastUpdate: String
});

exports.coinSchema = mongoose.model("coins", schema);