const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userID : String,
    serverID : String,
    userName: String,
    coins: Number,
    date: String
});

var coinSchema = mongoose.model("coin", schema);

exports.coin = coinSchema;