const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID : String,
    serverID : String,
    userName: String,
    coins: Number,
    date: String
});

exports.coinSchema = mongoose.model("coins", schema);